import { auth, sheets as googleSheets } from "@googleapis/sheets";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { format, startOfWeek } from "date-fns";

async function getSheetData(auth: any) {
  const sheets = googleSheets({
    version: "v4",
    auth,
  });

  try {
    // Specify the spreadsheet ID and range
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet!A1:F1000",
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    return res;
  } catch (error) {
    return error;
  }
}

export async function GET(request: NextRequest, response: NextResponse) {
  const oAuth2Client = new auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oAuth2Client.apiKey = process.env.GOOGLE_API_KEY;

  const token = await getToken({ req: request });

  oAuth2Client.setCredentials({
    access_token: token?.accessToken as string,
    refresh_token: token?.refreshToken as string,
  });
  const googleResponse: any = await getSheetData(oAuth2Client);

  console.log({ googleResponse });

  const res = NextResponse;
  if (googleResponse?.response?.data?.error)
    return res.json(
      { message: "Error", error: googleResponse?.response?.data?.error },
      { status: 401 }
    );

  const { data, headers } = reduceData(googleResponse?.data?.values);
  const monthlyData = groupBy(data, (row) => row.month);
  const weeklyData = groupBy(data, (row) =>
    format(startOfWeek(row.date), "dd-MMM-yyyy")
  );
  return res.json({
    message: "Successfully fetched",
    response: {
      headers,
      allTime: {
        data,
        total: getTotalValue(data),
      },
      monthly: {
        data: monthlyData,
        total: getTotalForGroupedData(monthlyData),
      },
      weekly: {
        data: weeklyData,
        total: getTotalForGroupedData(weeklyData),
      },
    },
  });
}

function reduceData(data: any[][] = []) {
  const [headers = [], ...expensesData] = data;

  const expensesArray = expensesData.map((row, index) => ({
    month: row[0],
    date: row[1],
    expanseType: row[2],
    description: row[3],
    amount: +row[4], // Convert amount to number
    transactionType: row[5],
  }));

  return {
    headers,
    data: expensesArray,
  };
}

export type Row = {
  month: any;
  date: any;
  expanseType: any;
  description: any;
  amount: number;
  transactionType: any;
};

function groupBy<T>(list: T[], keyGetter: (item: T) => string) {
  return list.reduce((map, item) => {
    const key = keyGetter(item);
    if (key in map) {
      map[key].push(item);
    } else {
      map[key] = [item];
    }
    return map;
  }, {} as Record<string, T[]>);
}

function getTotalValue(list: Row[]) {
  return list.reduce((sum, row) => row.amount + sum, 0);
}

function getTotalForGroupedData(list: Record<string, Row[]>) {
  return Object.entries(list).reduce((total, [key, value]) => {
    total[key] = getTotalValue(value);
    return total;
  }, {} as Record<string, number>);
}
