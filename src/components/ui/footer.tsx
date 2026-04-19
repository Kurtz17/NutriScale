export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-20 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xl font-black tracking-tight">
                NutriScale
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Platform cerdas pengelolaan gizi personal untuk masyarakat
              Indonesia. Berkontribusi pada SDGs poin 2: Zero Hunger.
            </p>
          </div>
          {['Produk'].map((title, i) => (
            <div key={i}>
              <h4 className="font-black text-lg mb-2">{title}</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Layanan AI
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Marketplace
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Kebijakan Privasi
                  </a>
                </li>
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-20 pt-8 border-t border-gray-50 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          © 2026 NutriScale. Pengembangan Perangkat Lunak, Teknik Informatika.
        </div>
      </div>
    </footer>
  );
}
