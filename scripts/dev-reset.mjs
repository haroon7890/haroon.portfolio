import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const projectRoot = process.cwd();
const lockPath = path.join(projectRoot, ".next", "dev", "lock");

function tryKillPid(pid) {
  if (!Number.isFinite(pid) || pid <= 0) return;

  // Best-effort cross-platform.
  try {
    process.kill(pid, "SIGTERM");
  } catch {
    // ignore
  }

  if (process.platform === "win32") {
    try {
      spawnSync("cmd.exe", ["/d", "/s", "/c", `taskkill /PID ${pid} /F`], {
        stdio: "ignore",
      });
    } catch {
      // ignore
    }
  }
}

try {
  if (!fs.existsSync(lockPath)) {
    process.stdout.write("No Next.js dev lock found.\n");
    process.exit(0);
  }

  const raw = fs.readFileSync(lockPath, "utf8");
  const lock = JSON.parse(raw);
  const pid = Number(lock?.pid);

  if (Number.isFinite(pid) && pid > 0) {
    process.stdout.write(`Clearing Next.js dev lock (pid=${pid}).\n`);
    tryKillPid(pid);
  } else {
    process.stdout.write("Clearing Next.js dev lock (pid missing/invalid).\n");
  }

  fs.rmSync(lockPath, { force: true });
  process.stdout.write("Lock removed.\n");
} catch (err) {
  process.stdout.write(`dev-reset: ${String(err?.message ?? err)}\n`);
  // Don’t block dev start if this fails.
  process.exit(0);
}
