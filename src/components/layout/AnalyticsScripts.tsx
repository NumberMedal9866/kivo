import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const YM_ID = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;

/**
 * Third-party analytics are injected ONLY when the corresponding
 * environment variable is present. No ID — no script, no request.
 */
export function AnalyticsScripts() {
  return (
    <>
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
          </Script>
        </>
      ) : null}
      {YM_ID ? (
        <Script id="yandex-metrica" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],
k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
ym(${Number(YM_ID)}, 'init', { clickmap:false, trackLinks:true, accurateTrackBounce:true });`}
        </Script>
      ) : null}
    </>
  );
}
