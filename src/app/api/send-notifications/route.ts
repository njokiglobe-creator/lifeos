import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { SCHEDULE } from "@/src/lib/schedule";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

webpush.setVapidDetails(
  "mailto:njokiglobe@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

function currentTimeString() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = currentTimeString();
  const matchIndex = SCHEDULE.findIndex((b) => b.time === now);
  if (matchIndex === -1) {
    return NextResponse.json({ sent: 0, reason: "No block starts now" });
  }

  const block = SCHEDULE[matchIndex];
  const previous = matchIndex > 0 ? SCHEDULE[matchIndex - 1] : null;

  const title = previous ? `✅ ${previous.label} complete` : `⏰ Time for: ${block.label}`;
  const body = previous ? `Time for: ${block.label}` : "";

  const db = getFirestore();
  const usersSnap = await db.collection("users").get();

  let sent = 0;
  for (const userDoc of usersSnap.docs) {
    const subDoc = await db
      .collection("users")
      .doc(userDoc.id)
      .collection("settings")
      .doc("pushSubscription")
      .get();

    if (!subDoc.exists) continue;
    const { subscription } = subDoc.data() as { subscription: webpush.PushSubscription };

    try {
      await webpush.sendNotification(subscription, JSON.stringify({ title, body, tag: block.id }));
      sent++;
    } catch (err) {
      console.error(`Push failed for user ${userDoc.id}:`, err);
    }
  }

  return NextResponse.json({ sent, block: block.label });
}
