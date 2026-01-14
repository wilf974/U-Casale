import bcrypt from "bcryptjs"

async function testPassword() {
  const password = "admin123"
  const hashInDatabase = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"

  console.log("Testing password verification...")
  console.log("Password:", password)
  console.log("Hash in DB:", hashInDatabase)

  const isMatch = await bcrypt.compare(password, hashInDatabase)
  console.log("Match:", isMatch)

  if (!isMatch) {
    console.log("\n❌ The hash does NOT match the password!")
    console.log("Generating new hash for 'admin123'...")
    const newHash = await bcrypt.hash(password, 10)
    console.log("\nNew correct hash:")
    console.log(newHash)
    console.log("\nUse this SQL to update the password:")
    console.log(`UPDATE users SET password = '${newHash}' WHERE email = 'admin@ucasale.com';`)
  } else {
    console.log("\n✅ The hash matches! The problem might be elsewhere.")
  }
}

testPassword()
