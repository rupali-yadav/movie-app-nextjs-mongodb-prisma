import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/src/lib/serverAuth";

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return resp.status(405).end();
    }

    const { currentUser } = await serverAuth(req, resp);

    return resp.status(200).json(currentUser);
    
  } catch (error) {
    console.log(error);
    return resp.status(500).end();
  }
}
