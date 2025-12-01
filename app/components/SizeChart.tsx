import React from "react";

const sizeData = [
  {
    size: "XS",
    panjang: 65,
    lebarDada: 38,
    lebarBahu: 35,
    panjangLengan: 19,
  },
  {
    size: "S",
    panjang: 68,
    lebarDada: 41,
    lebarBahu: 37,
    panjangLengan: 20,
  },
  {
    size: "M",
    panjang: 71,
    lebarDada: 44,
    lebarBahu: 40,
    panjangLengan: 21,
  },
  {
    size: "L",
    panjang: 74,
    lebarDada: 47,
    lebarBahu: 42,
    panjangLengan: 22,
  },
  {
    size: "XL",
    panjang: 77,
    lebarDada: 50,
    lebarBahu: 44,
    panjangLengan: 23,
  },
  {
    size: "2XL",
    panjang: 80,
    lebarDada: 53,
    lebarBahu: 46,
    panjangLengan: 24,
  },
];

export function SizeChart() {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 overflow-x-auto">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
        Tabel Ukuran T-Shirt
      </h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/20">
            <th className="text-left py-4 px-4 text-white/80 font-semibold">
              Ukuran
            </th>
            <th className="text-left py-4 px-4 text-white/80 font-semibold">
              Panjang (cm)
            </th>
            <th className="text-left py-4 px-4 text-white/80 font-semibold">
              Lebar Dada (cm)
            </th>
            <th className="text-left py-4 px-4 text-white/80 font-semibold">
              Lebar Bahu (cm)
            </th>
            <th className="text-left py-4 px-4 text-white/80 font-semibold">
              Panjang Lengan (cm)
            </th>
          </tr>
        </thead>
        <tbody>
          {sizeData.map((row, index) => (
            <tr
              key={row.size}
              className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                index % 2 === 0 ? "bg-white/5" : ""
              }`}
            >
              <td className="py-4 px-4 text-white font-semibold">{row.size}</td>
              <td className="py-4 px-4 text-gray-300">{row.panjang}</td>
              <td className="py-4 px-4 text-gray-300">{row.lebarDada}</td>
              <td className="py-4 px-4 text-gray-300">{row.lebarBahu}</td>
              <td className="py-4 px-4 text-gray-300">{row.panjangLengan}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-gray-400 text-sm mt-6 flex items-center gap-2">
        <span className="text-lg">💡</span> Tip: Ukuran diambil dengan baju
        dalam keadaan terbentang. Semua ukuran dalam satuan sentimeter (cm).
      </p>
    </div>
  );
}
