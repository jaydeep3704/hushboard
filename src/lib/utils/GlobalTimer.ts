// ✅ Timer Type
interface Timer {
  startTime: Date;
  expiresAt: Date;
  callback: (timeLeft: string, isExpired: boolean, progressPercent: number) => void;
}

export class GlobalTimer {
  private timers = new Map<string, Timer>();
  private intervalId: NodeJS.Timeout | null = null;

  // ✅ Subscribe (need startTime now)
  subscribe(
    id: string,
    startTime: Date,
    expiresAt: Date,
    callback: (timeLeft: string, isExpired: boolean, progressPercent: number) => void
  ) {
    this.timers.set(id, { startTime, expiresAt, callback });
    if (!this.intervalId) {
      this.startTicking();
    }
  }

  unsubscribe(id: string) {
    this.timers.delete(id);
    if (this.timers.size === 0) {
      this.stopTicking();
    }
  }

  private startTicking() {
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  private stopTicking() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick() {
    const now = Date.now();

    for (const [id, timer] of this.timers) {
      const timeLeftMs = timer.expiresAt.getTime() - now;

      if (timeLeftMs <= 0) {
        timer.callback("Expired", true, 100);
        this.timers.delete(id);
      } else {
        // Format time left
        const days = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeftMs / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeLeftMs / (1000 * 60)) % 60);
        const seconds = Math.floor((timeLeftMs / 1000) % 60);

        let timeLeft = "";
        if (days > 0) {
          timeLeft = `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
          timeLeft = `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
          timeLeft = `${minutes}m ${seconds}s`;
        } else {
          timeLeft = `${seconds}s`;
        }

        // ✅ Calculate progress
        const totalDurationMs = timer.expiresAt.getTime() - timer.startTime.getTime();
        const timeElapsedMs = now - timer.startTime.getTime();
        const progressPercent = Math.min(100, Math.max(0, (timeElapsedMs / totalDurationMs) * 100));

        timer.callback(timeLeft, false, progressPercent);
      }
    }

    if (this.timers.size === 0) {
      this.stopTicking();
    }
  }
}

// ✅ Export singleton
export const gt = new GlobalTimer();
