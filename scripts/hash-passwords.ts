import bcrypt from "bcryptjs"

const kols = [
  { kol_id: "hoaitam", password: "hoaitam@123" },
  { kol_id: "quangdo", password: "quangdo@123" },
  { kol_id: "nhanly", password: "nhanly@123" },
  { kol_id: "khangduong", password: "khangduong@123" },
  { kol_id: "thuannguyen", password: "thuannguyen@123" },
  { kol_id: "rockydinh", password: "rockydinh@123" },
]

async function run() {
  console.log("🔐 Generating password hashes...\n")

  for (const k of kols) {
    const hash = await bcrypt.hash(k.password, 10)
    console.log(`${k.kol_id} => ${hash}`)
  }

  console.log("\n✅ Done")
}

run().catch((e) => {
  console.error("❌ Error:", e)
})
