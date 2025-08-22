import { ButtonPrimary, ButtonOutline } from './Button';

function Hero() {
  return (
    <section id="home" className="pt-28 lg:pt-36">
      <div className="container items-center text-left lg:grid lg:grid-cols-2 lg:gap-10">
        <div>
          <div className="flex items-center gap-3">
            <figure className="img-box w-9 h-9 rounded-lg overflow-hidden">
              <img
                src="/avatar-1.jpg"
                width={40}
                height={40}
                alt="Rangga Mukti Portrait"
                className="img-cover"
              />
            </figure>

            {/* text muted mengikuti palet: dark=zinc-400, light akan tetap terbaca */}
            <div className="flex items-center gap-1.5 text-zinc-400 text-sm tracking-wide">
              <span className="relative inline-flex w-2 h-2">
                {/* dot solid */}
                <span className="absolute inset-0 rounded-full bg-emerald-400"></span>
                {/* ping anim */}
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"></span>
              </span>
              Available for work
            </div>
          </div>

          <h2 className="headline-1 max-w-[15ch] sm:max-w-[20ch] lg:max-w-[15ch] mt-5 mb-8 lg:mb-10">
            Building Scalable Modern Websites for the Future
          </h2>

          <div className="flex items-center gap-3">
            <ButtonPrimary label="Download CV" icon="download" />
            <ButtonOutline href="#about" label="Scroll down" icon="arrow_downward" />
          </div>
        </div>

        <div className="hidden lg:block">
          {/* Wrapper gambar dengan aksen gradient yang aman di Dark & Light */}
          <figure className="w-full max-w-[480px] ml-auto rounded-[60px] overflow-hidden bg-gradient-to-t from-sky-400/40 via-sky-400/20 to-transparent">
            <img
              src="/hero-banner.png"
              width={800}
              height={800}
              alt="Rangga Mukti"
              className="w-full"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}

export default Hero;
