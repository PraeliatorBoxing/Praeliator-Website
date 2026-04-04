import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";

type ObjectDossierSlide = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  notes: Array<{ label: string; value: string }>;
};

export function ObjectDossierCarousel({
  slides,
}: {
  slides: ObjectDossierSlide[];
}) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade()]);

  React.useEffect(() => {
    if (!emblaApi) return;

    const syncSelection = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    syncSelection();
    emblaApi.on("select", syncSelection);
    emblaApi.on("reInit", syncSelection);

    return () => {
      emblaApi.off("select", syncSelection);
      emblaApi.off("reInit", syncSelection);
    };
  }, [emblaApi]);

  return (
    <div className="overflow-hidden rounded-[2.3rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,14,13,0.94),rgba(10,9,8,0.98))] shadow-[0_36px_100px_rgba(0,0,0,0.34)]">
      <div className="flex flex-col gap-5 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
            Archive carousel
          </p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
            A quieter object-study strip for the parts of VIS that matter most.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-sm uppercase tracking-[0.18em] text-white/74 transition duration-500 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-sm uppercase tracking-[0.18em] text-white/74 transition duration-500 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            Next
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={slide.title} className="min-w-0 flex-[0_0_100%]">
              <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
                <div className="relative min-h-[22rem] overflow-hidden border-b border-white/10 lg:min-h-[34rem] lg:border-b-0 lg:border-r">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.image})` }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14),rgba(0,0,0,0.72))]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,161,141,0.16),transparent_32%)]" />
                  <div className="relative z-10 flex h-full items-end p-6 sm:p-8">
                    <div className="max-w-[18rem]">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b39b]">
                        {slide.eyebrow}
                      </p>
                      <p className="mt-4 text-3xl font-semibold leading-[0.92] tracking-[-0.055em] text-[#f4efe7] sm:text-4xl">
                        {slide.title}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                    Plate {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                    {slide.body}
                  </p>

                  <div className="mt-8 divide-y divide-white/10 border-t border-white/10">
                    {slide.notes.map((note) => (
                      <div
                        key={`${slide.title}-${note.label}`}
                        className="grid gap-2 py-4 sm:grid-cols-[120px_1fr]"
                      >
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/38 sm:text-[11px]">
                          {note.label}
                        </p>
                        <p className="text-sm leading-7 text-white/78">
                          {note.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-white/10 px-6 py-4 sm:px-8">
        {slides.map((slide, index) => {
          const active = index === selectedIndex;
          return (
            <button
              key={slide.title}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition duration-500 ${
                active
                  ? "border-[#b89a75] bg-[#181513] text-[#f4efe7]"
                  : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/18 hover:text-white/80"
              }`}
            >
              {slide.eyebrow}
            </button>
          );
        })}
      </div>
    </div>
  );
}
