import { NextRequest } from "next/server";
import { POST as leadsPost, GET as leadsGet } from "../leads/route";

export async function POST(req: NextRequest) {
  return leadsPost(req);
}

export async function GET(req: NextRequest) {
  return leadsGet(req);
}
