import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE_EMAIL, SITE_PHONE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Məxfilik siyasəti",
  description: "Cənub Xəbər saytında şəxsi məlumatların toplanması, istifadəsi və qorunması qaydaları.",
};

export default function Page() {
  return (
    <LegalPage
      title="Məxfilik siyasəti"
      updated="9 oktyabr 2026"
      intro="Bu siyasət cenubxeber.com (“Cənub Xəbər”, “Sayt”) saytından istifadə zamanı məlumatlarınızın necə toplandığını, istifadə edildiyini və qorunduğunu izah edir."
      sections={[
        { h: "Ümumi müddəalar", p: [
          "Cənub Xəbər oxucuların məxfiliyinə hörmət edir və şəxsi məlumatların emalını Azərbaycan Respublikasının qüvvədə olan qanunvericiliyinə, o cümlədən “Fərdi məlumatlar haqqında” Qanuna uyğun həyata keçirməyə çalışır.",
          "Saytdan istifadə etməklə bu siyasətin şərtləri ilə razılaşmış olursunuz. Razı deyilsinizsə, zəhmət olmasa saytdan istifadə etməyin.",
        ] },
        { h: "Hansı məlumatları toplayırıq", list: [
          "Əlaqə formu vasitəsilə göndərdiyiniz məlumatlar: ad, e-poçt ünvanı və mesajınızın mətni.",
          "Texniki məlumatlar: brauzer növü, cihaz, əməliyyat sistemi, təxmini coğrafi məkan, IP ünvanı və səhifələrə baxış statistikası.",
          "Xəbər səhifələrinin baxış sayğacı (hansı xəbərin neçə dəfə oxunduğu) — bu məlumat şəxsiyyətinizi müəyyən etmir.",
          "Bizə e-poçt göndərdiyiniz və ya zəng etdiyiniz halda, sizin təqdim etdiyiniz əlaqə məlumatları.",
        ] },
        { h: "Məlumatlardan istifadə məqsədləri", list: [
          "Müraciətlərinizə cavab vermək və redaksiya ilə əlaqəni təmin etmək.",
          "Saytın işini, təhlükəsizliyini və məzmun keyfiyyətini yaxşılaşdırmaq.",
          "Ən çox oxunan xəbərləri müəyyən etmək və ümumi statistika aparmaq.",
          "Qanunvericiliyin tələblərini yerinə yetirmək və sui-istifadənin qarşısını almaq.",
        ] },
        { h: "Kukilər (cookies) və oxşar texnologiyalar", p: [
          "Sayt işləməsi, istifadə rahatlığı və statistika məqsədilə kukilərdən və brauzerin yerli yaddaşından istifadə edə bilər. Məsələn, eyni xəbərin baxış sayının bir sessiyada təkrar hesablanmaması üçün brauzerin müvəqqəti yaddaşı istifadə olunur.",
          "Kukiləri brauzer ayarlarından istənilən vaxt silə və ya bloklaya bilərsiniz. Bu halda saytın bəzi funksiyaları məhdud işləyə bilər.",
        ] },
        { h: "Məlumatların üçüncü tərəflərlə bölüşülməsi", p: [
          "Şəxsi məlumatlarınızı satmırıq. Yalnız saytın işləməsi üçün zəruri olan xidmət təminatçıları ilə məlumat mübadiləsi baş verə bilər:",
        ], list: [
          "Hosting və infrastruktur xidmətləri (Vercel).",
          "Verilənlər bazası xidməti (Supabase) — xəbərlər və əlaqə mesajları burada saxlanılır.",
          "Şəkil yükləmə xidməti (ImgBB) — redaksiya tərəfindən yüklənən xəbər şəkilləri üçün.",
          "Qanunvericiliyin tələb etdiyi hallarda səlahiyyətli dövlət orqanları.",
        ] },
        { h: "Sosial şəbəkələr və xarici saytlar", p: [
          "Saytda Facebook, Instagram, YouTube, TikTok və digər platformalara keçidlər, eləcə də xəbəri paylaşmaq düymələri var. Bu platformalara keçdikdən sonra onların öz məxfilik siyasətləri tətbiq olunur və biz onların məlumat təcrübələrinə görə məsuliyyət daşımırıq.",
          "Xəbərlərdə üçüncü tərəf saytlara istinadlar ola bilər; həmin saytların məzmunu və məxfilik qaydaları bizim nəzarətimizdən kənardadır.",
        ] },
        { h: "Saxlanma müddəti", p: [
          "Əlaqə mesajları müraciətə cavab verilənə və qanunvericilikdə nəzərdə tutulan zəruri müddət ərzində saxlanılır, sonra silinir və ya anonimləşdirilir. Texniki qeydlər isə təhlükəsizlik və statistika üçün zəruri olan qədər saxlanılır.",
        ] },
        { h: "Məlumatların təhlükəsizliyi", p: [
          "Məlumatların icazəsiz giriş, itirilmə və ya dəyişdirilmədən qorunması üçün məqbul texniki və təşkilati tədbirlər görürük: şifrələnmiş (HTTPS) bağlantı, məhdud giriş hüquqları və qorunan admin panel. Lakin internet üzərindən məlumat ötürülməsinin tam təhlükəsizliyini təminat etmək mümkün deyil.",
        ] },
        { h: "Sizin hüquqlarınız", p: ["Qanunvericiliyə uyğun olaraq aşağıdakı hüquqlara maliksiniz:"], list: [
          "Haqqınızda hansı məlumatların saxlandığını öyrənmək.",
          "Yanlış və ya natamam məlumatların düzəldilməsini tələb etmək.",
          "Məlumatlarınızın silinməsini və ya emalının dayandırılmasını tələb etmək.",
          "Məlumatların emalına verdiyiniz razılığı geri götürmək.",
        ] },
        { h: "Uşaqların məxfiliyi", p: [
          "Sayt 16 yaşdan kiçik uşaqlara məqsədyönlü şəkildə şəxsi məlumat toplamır. Uşağın məlumat təqdim etdiyini aşkar etsəniz, bizimlə əlaqə saxlayın — həmin məlumatları siləcəyik.",
        ] },
        { h: "Siyasətdə dəyişikliklər", p: [
          "Bu siyasət vaxtaşırı yenilənə bilər. Dəyişikliklər bu səhifədə dərc olunduğu andan qüvvəyə minir; səhifənin yuxarısında son yenilənmə tarixi göstərilir.",
        ] },
        { h: "Əlaqə", p: [
          `Məxfilik ilə bağlı sualları və müraciətləri ${SITE_EMAIL} ünvanına və ya ${SITE_PHONE} nömrəsinə göndərə bilərsiniz.`,
        ] },
      ]}
    />
  );
}
