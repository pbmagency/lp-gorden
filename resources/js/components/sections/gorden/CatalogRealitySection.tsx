import type { MouseEventHandler } from 'react';

type CatalogRealitySectionProps = {
    onWhatsAppClick: MouseEventHandler<HTMLAnchorElement>;
    onCatalogClick: MouseEventHandler<HTMLAnchorElement>;
};

export const catalogRealityStyles = `
  .catalog-reality {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    background: #F2EDE3;
    color: #221F1A;
    padding: 20px 0 36px;
  }
  .catalog-reality__inner {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 clamp(20px, 3vw, 34px);
  }
  .catalog-reality__eyebrow {
    margin: 0 0 12px;
    color: #96876C;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.5;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }
  .catalog-reality__title {
    max-width: 820px;
    margin: 0 0 10px;
    color: #111827;
    font-family: Poppins, Helvetica, sans-serif;
    font-size: clamp(32px, 3.7vw, 42px);
    font-weight: 700;
    line-height: 1.16;
    letter-spacing: -0.035em;
    text-wrap: pretty;
  }
  .catalog-reality__intro {
    max-width: 790px;
    margin: 0 0 36px;
    color: #584F43;
    font-size: clamp(16px, 1.75vw, 20px);
    line-height: 1.55;
    text-wrap: pretty;
  }
  .catalog-reality__cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 21px;
    margin: 0 0 24px;
  }
  .catalog-reality__card {
    min-height: 312px;
    display: flex;
    flex-direction: column;
    padding: 31px 29px 29px;
    border-radius: 5px;
  }
  .catalog-reality__card--light {
    background: #FCFAF6;
    border: 1px solid #E5DDCF;
  }
  .catalog-reality__card--dark {
    background: #23201B;
    color: #FFFFFF;
  }
  .catalog-reality__card-title {
    margin: 0 0 18px;
    font-size: 21px;
    font-weight: 600;
    line-height: 1.45;
    letter-spacing: -0.02em;
  }
  .catalog-reality__card--light .catalog-reality__card-title {
    color: #877E6D;
  }
  .catalog-reality__card--dark .catalog-reality__card-title {
    color: #FFFFFF;
  }
  .catalog-reality__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .catalog-reality__item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 18px;
    line-height: 1.72;
  }
  .catalog-reality__number {
    flex: 0 0 16px;
    padding-top: 3px;
    color: #A89577;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
    font-weight: 500;
    line-height: 2.3;
  }
  .catalog-reality__card--light .catalog-reality__item {
    color: #4F4840;
  }
  .catalog-reality__card--dark .catalog-reality__number {
    color: rgba(255, 255, 255, 0.65);
  }
  .catalog-reality__card--dark .catalog-reality__item {
    color: rgba(255, 255, 255, 0.96);
  }
  .catalog-reality__result {
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid #E5DDCF;
    font-size: 18px;
    line-height: 1.55;
  }
  .catalog-reality__card--light .catalog-reality__result {
    color: #6F6656;
    font-weight: 500;
  }
  .catalog-reality__card--dark .catalog-reality__result {
    border-top-color: rgba(255, 255, 255, 0.18);
    color: #FFFFFF;
    font-weight: 700;
  }
  .catalog-reality__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .catalog-reality__cta {
    min-height: 63px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 18px;
    border-radius: 13px;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.35;
    text-decoration: none;
    transition: transform 160ms ease, background-color 160ms ease, box-shadow 160ms ease;
  }
  .catalog-reality__cta:hover {
    transform: translateY(-1px);
  }
  .catalog-reality__cta--primary {
    flex: 1 1 260px;
    background: #25D366;
    color: #FFFFFF;
    box-shadow: 0 10px 26px -8px rgba(37, 211, 102, 0.48);
  }
  .catalog-reality__cta--primary:hover {
    background: #1FBA57;
    color: #FFFFFF;
  }
  .catalog-reality__cta--secondary {
    flex: 1 1 200px;
    background: #FCFAF6;
    border: 2px solid #221F1A;
    color: #221F1A;
  }
  .catalog-reality__cta--secondary:hover {
    background: #F7F2E9;
    color: #221F1A;
  }
  .catalog-reality__whatsapp {
    flex: none;
    width: 21px;
    height: 21px;
    display: block;
    margin-right: 10px;
  }
  .catalog-reality__trust {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px 10px;
    margin: 12px 0 0;
    color: #4F4840;
    font-size: 12.5px;
    line-height: 1.5;
  }
  .catalog-reality__stars {
    color: #C69A2E;
    letter-spacing: 1px;
  }
  .catalog-reality__dot {
    opacity: 0.5;
  }

  @media (max-width: 760px) {
    .catalog-reality {
      padding: 36px 0 44px;
    }
    .catalog-reality__inner {
      padding: 0 16px;
    }
    .catalog-reality__title {
      font-size: clamp(28px, 8.4vw, 34px);
      line-height: 1.18;
    }
    .catalog-reality__intro {
      margin-bottom: 26px;
      font-size: 15.5px;
    }
    .catalog-reality__cards {
      grid-template-columns: 1fr;
      gap: 14px;
      margin-bottom: 20px;
    }
    .catalog-reality__card {
      min-height: 0;
      padding: 24px;
    }
    .catalog-reality__card-title {
      margin-bottom: 16px;
      font-size: 18px;
    }
    .catalog-reality__item,
    .catalog-reality__result {
      font-size: 15.5px;
    }
    .catalog-reality__list {
      gap: 9px;
    }
    .catalog-reality__result {
      margin-top: 22px;
      padding-top: 15px;
    }
    .catalog-reality__cta {
      flex-basis: 100%;
      min-height: 56px;
      font-size: 16px;
    }
  }
`;

export default function CatalogRealitySection({
    onWhatsAppClick,
    onCatalogClick,
}: CatalogRealitySectionProps) {
    return (
        <section
            className="catalog-reality"
            aria-labelledby="catalog-reality-title"
            data-section="catalog-reality"
        >
            <div className="catalog-reality__inner">
                <p className="catalog-reality__eyebrow">Tahukah Kamu?</p>
                <h2
                    id="catalog-reality-title"
                    className="catalog-reality__title"
                >
                    Bagus di foto katalog, zonk saat dipasang di rumah.
                </h2>
                <p className="catalog-reality__intro">
                    Banyak yang tergiur gorden murah karena fotonya bagus, tapi
                    warna dan ukurannya ternyata tidak cocok di rumah sendiri.
                </p>

                <div className="catalog-reality__cards">
                    <article className="catalog-reality__card catalog-reality__card--light">
                        <h3 className="catalog-reality__card-title">
                            Kalau langsung beli
                        </h3>
                        <ol className="catalog-reality__list">
                            <li className="catalog-reality__item">
                                <span className="catalog-reality__number">
                                    01
                                </span>
                                <span>Pilih model dari foto katalog.</span>
                            </li>
                            <li className="catalog-reality__item">
                                <span className="catalog-reality__number">
                                    02
                                </span>
                                <span>Tebak sendiri warna dan ukurannya.</span>
                            </li>
                            <li className="catalog-reality__item">
                                <span className="catalog-reality__number">
                                    03
                                </span>
                                <span>Terpasang, tapi rasanya kurang pas.</span>
                            </li>
                        </ol>
                        <div className="catalog-reality__result">
                            Hemat sekali, nyesek tiap hari.
                        </div>
                    </article>

                    <article className="catalog-reality__card catalog-reality__card--dark">
                        <h3 className="catalog-reality__card-title">
                            Kalau konsultasi dengan owner berpengalaman
                        </h3>
                        <ol className="catalog-reality__list">
                            <li className="catalog-reality__item">
                                <span className="catalog-reality__number">
                                    01
                                </span>
                                <span>
                                    Cerita kebutuhan dan budget ke owner.
                                </span>
                            </li>
                            <li className="catalog-reality__item">
                                <span className="catalog-reality__number">
                                    02
                                </span>
                                <span>Kami survey dan ukur di rumah Anda.</span>
                            </li>
                            <li className="catalog-reality__item">
                                <span className="catalog-reality__number">
                                    03
                                </span>
                                <span>Terpasang, dan memang pas.</span>
                            </li>
                        </ol>
                        <div className="catalog-reality__result">
                            Dipilih untuk rumah Anda, bukan untuk foto katalog.
                        </div>
                    </article>
                </div>

                <div className="catalog-reality__actions">
                    <a
                        href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F"
                        target="_blank"
                        rel="noopener"
                        className="catalog-reality__cta catalog-reality__cta--primary"
                        onClick={onWhatsAppClick}
                    >
                        <img
                            src="/assets/whatsapp.svg"
                            alt=""
                            className="catalog-reality__whatsapp"
                        />
                        Konsultasi Gratis&nbsp; →
                    </a>
                    <a
                        href="#katalog"
                        className="catalog-reality__cta catalog-reality__cta--secondary"
                        onClick={onCatalogClick}
                    >
                        Lihat Katalog →
                    </a>
                </div>

                <div
                    className="catalog-reality__trust"
                    aria-label="Kepercayaan pelanggan"
                >
                    <span className="catalog-reality__stars">★★★★★</span>
                    <strong>5,0</strong>
                    <span>Google Review</span>
                    <span className="catalog-reality__dot">•</span>
                    <span>1.000+ pembeli</span>
                    <span className="catalog-reality__dot">•</span>
                    <span>Garansi pemasangan 14 hari</span>
                </div>
            </div>
        </section>
    );
}
