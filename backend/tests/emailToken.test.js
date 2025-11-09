/*
  Simple test runner for email token flow.
  Usage: set MONGO_URI env var (or default to mongodb://127.0.0.1:27017/studenteramern_test)
  Then run: node backend/tests/emailToken.test.js

  This script creates a token document, attempts to find it by hashing, marks it used, and cleans up.
*/
const mongoose = require("mongoose");
const crypto = require("crypto");
const EmailToken = require("../models/EmailToken");

const MONGO =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/studenteramern_test";

async function run() {
  console.log("Connecting to", MONGO);
  await mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    const email = `test+${Date.now()}@example.com`;
    const token = crypto.randomBytes(16).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const doc = await EmailToken.create({
      email,
      tokenHash,
      expiresAt,
      used: false,
    });
    console.log("Created token doc id=", doc._id.toString());

    // Lookup using token
    const found = await EmailToken.findOne({ email, tokenHash, used: false });
    if (!found) throw new Error("Failed to find token by hash");
    console.log("Found token by hash OK");

    // Mark used
    found.used = true;
    await found.save();

    const shouldNotFind = await EmailToken.findOne({
      email,
      tokenHash,
      used: false,
    });
    if (shouldNotFind)
      throw new Error(
        "Token should have been marked used but still found as unused"
      );
    console.log("Mark used logic OK");

    // Cleanup
    await EmailToken.deleteMany({ email });
    console.log("Cleanup OK");

    console.log("All tests passed");
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(2);
  } finally {
    try {
      await mongoose.disconnect();
    } catch (e) {}
  }
}

run();
