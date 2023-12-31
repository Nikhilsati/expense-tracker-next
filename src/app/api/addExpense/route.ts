import { auth, sheets as googleSheets } from "@googleapis/sheets";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { AddExpensePayload, Expense } from "@/types/expense";
import { format } from "date-fns";

async function addExpenseToSheet(auth: any, values: Expense[]) {
  const sheets = googleSheets({
    version: "v4",
    auth,
  });

  try {
    // Specify the spreadsheet ID and range
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    const res = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet!A1:F1000",
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
}

export async function POST(request: NextRequest, response: NextResponse) {
  const body = await request.json();
  console.log({
    body,
    cookie: request.headers.get("cookie"),
    request: request.headers,
  });

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
  const googleResponse: any = await addExpenseToSheet(
    oAuth2Client,
    body.map((item: AddExpensePayload) => {
      const date = new Date(item.date);
      return [
        format(date, "MMMM"),
        format(date, "dd-MMM-yyyy"),
        item.expenseType,
        item.description ?? "",
        item.amount,
        item?.transactionType ?? null,
      ];
    })
  );
  const res = NextResponse;
  if (googleResponse?.response?.data?.error)
    return res.json(
      { message: "Error", error: googleResponse?.response?.data?.error },
      { status: 401 }
    );
  return res.json({
    message: "Successfully added",
    response: googleResponse.data,
  });
}
