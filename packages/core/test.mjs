import { hashPassword } from 'better-auth/crypto';

async function run() {
  const hash = await hashPassword("Hitesh@55#llmops");
  console.log("HASH:", hash);
}
run();
