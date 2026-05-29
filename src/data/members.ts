export interface Member {
  id: string;
  name: string;
  degree: string;
  nim: string;
  topic: string;
  type: "skripsi" | "proposal";
  emoji: string;
  photoUrl?: string;
  celebrationAudioUrl?: string;
}

export interface EventConfig {
  id: string;
  title: string;
  date: string;
  time: string;
  place: string;
  campus: string;
  prodi: string;
  batch: string;
  members: Member[];
  isActive: boolean;
  createdAt: string;
}

export interface RSVP {
  id: string;
  eventId: string;
  guestName: string;
  status: "hadir" | "tidak_hadir" | "mungkin";
  message?: string;
  qrCode: string;
  createdAt: string;
}

export const DEFAULT_EVENTS: EventConfig[] = [
  {
    id: "default-event",
    title: "Sidang Skripsi - Batch TI 2022",
    date: "2026-05-28",
    time: "09:00",
    place: "Ruang Sidang Lt. 3",
    campus: "Universitas XYZ",
    prodi: "PROGRAM STUDI TEKNOLOGI INFORMASI",
    batch: "ANGKATAN 2022",
    isActive: true,
    createdAt: new Date().toISOString(),
    members: [
      { id: "m1", name: "John Doe", degree: "S.Kom", nim: "2022101001", topic: "Implementasi Machine Learning untuk Prediksi Cuaca", type: "skripsi", emoji: "👨‍💻" },
      { id: "m2", name: "Jane Smith", degree: "S.Kom", nim: "2022101002", topic: "Analisis Keamanan Jaringan Berbasis IoT", type: "skripsi", emoji: "👩‍💻" },
      { id: "m3", name: "Ahmad Rizky", degree: "S.Kom", nim: "2022101003", topic: "Pengembangan Aplikasi E-Commerce dengan React Native", type: "proposal", emoji: "🧑‍💻" },
      { id: "m4", name: "Siti Nurhaliza", degree: "S.Kom", nim: "2022101004", topic: "Sistem Rekomendasi Film menggunakan Collaborative Filtering", type: "skripsi", emoji: "👩‍🎓" },
      { id: "m5", name: "Budi Santoso", degree: "S.Kom", nim: "2022101005", topic: "Perancangan UI/UX Dashboard Monitoring Server", type: "proposal", emoji: "👨‍🎓" },
      { id: "m6", name: "Dewi Lestari", degree: "S.Kom", nim: "2022101006", topic: "Deteksi Objek Real-time dengan YOLOv8", type: "skripsi", emoji: "👩‍🔬" },
    ],
  },
];
