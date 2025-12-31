import "dotenv/config"
import prisma from "../app/lib/prisma"

async function testDatabase() {
  console.log("🔍 Testing Prisma Postgres connection...\n")

  try {
    console.log("✅ Connected to database!")

    console.log("\n📝 Creating a test saved tweet...")
    const newTweet = await prisma.savedTweet.create({
      data: {
        original: "just shipped a new feature, its pretty cool i think",
        transformed: "Just shipped a new feature! 🚀 Pretty excited about this one ✨",
        context: "Tech founder, casual tone",
      },
    })
    console.log("✅ Created saved tweet:", newTweet)

    console.log("\n📋 Fetching all saved tweets...")
    const allTweets = await prisma.savedTweet.findMany()
    console.log(`✅ Found ${allTweets.length} saved tweet(s)`)

    console.log("\n🎉 All tests passed! Your database is working perfectly.\n")
  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
}

testDatabase()