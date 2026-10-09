import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE_EMAIL, SITE_PHONE } from "@/lib/site";

export const metadata: Metadata = {
  title: "İstifadə şərtləri",
  description: "Cənub Xəbər saytından istifadə qaydaları, müəllif hüquqları və məsuliyyətin məhdudlaşdırılması.",
};

export default function Page() {
  return (
    <LegalPage
      title="İstifadə şərtləri"
      updated="9 oktyabr 2026"
      intro="Cənub Xəbər saytından istifadə etməzdən əvvəl bu şərtlərlə tanış olun. Saytdan istifadə bu şərtləri qəbul etdiyiniz anlamına gəlir."
      sections={[
        { h: "Ümumi müddəalar", p: [
          "Bu şərtlər cenubxeber.com saytından (“Sayt”) və onun təqdim etdiyi məzmundan istifadə qaydalarını müəyyən edir. Sayt Cənub Xəbər redaksiyası tərəfindən idarə olunur.",
          "Şərtləri istənilən vaxt dəyişmək hüququnu özümüzdə saxlayırıq. Dəyişikliklər bu səhifədə dərc olunduğu andan qüvvəyə minir.",
        ] },
        { h: "Məzmunun xarakteri", p: [
          "Saytda dərc olunan xəbərlər, məqalələr və digər materiallar informasiya xarakteri daşıyır. Redaksiya məlumatların dəqiqliyinə çalışsa da, bütün materialın tam, səhvsiz və hər zaman aktual olduğuna təminat vermir.",
          "Müəlliflərin və müsahibə verənlərin fikirləri redaksiyanın mövqeyini əks etdirməyə bilər. Maliyyə, hüquq, tibb və digər peşəkar məsələlərdə saytdakı məlumat mütəxəssis məsləhətini əvəz etmir.",
        ] },
        { h: "Müəllif hüquqları və məzmundan istifadə", p: [
          "Saytdakı mətnlər, şəkillər, qrafika, logotip və dizayn Cənub Xəbərə və ya müvafiq hüquq sahiblərinə məxsusdur və müəllif hüquqları haqqında qanunvericiliklə qorunur.",
        ], list: [
          "Materialların şəxsi, qeyri-kommersiya məqsədilə oxunmasına və sosial şəbəkələrdə paylaşılmasına icazə verilir.",
          "Xəbərlərdən qısa sitat gətirmək yalnız Cənub Xəbərə aktiv hiperlink verməklə mümkündür.",
          "Materialların redaksiyanın yazılı razılığı olmadan tam və ya hissə-hissə kommersiya məqsədilə yenidən dərc edilməsi, satılması və ya avtomatik üsullarla kütləvi surətdə köçürülməsi qadağandır.",
          "Şəkillərdən və videolardan istifadə üçün ayrıca icazə tələb oluna bilər.",
        ] },
        { h: "İstifadəçinin öhdəlikləri", p: ["Saytdan istifadə edərkən aşağıdakıları etməməlisiniz:"], list: [
          "Saytın işinə, təhlükəsizliyinə və ya digər istifadəçilərə zərər vuran hərəkətlər (həddindən artıq sorğu, zərərli kod, icazəsiz giriş cəhdləri).",
          "Qanunsuz, təhqiramiz, böhtan xarakterli və ya üçüncü şəxslərin hüquqlarını pozan məlumat göndərmək.",
          "Əlaqə formu vasitəsilə saxta, yanıldıcı və ya spam xarakterli mesajlar göndərmək.",
          "Admin panelə və ya saytın qorunan hissələrinə icazəsiz daxil olmağa cəhd etmək.",
        ] },
        { h: "Redaksiyaya göndərilən materiallar", p: [
          "Redaksiyaya xəbər, foto, video və ya digər material göndərdikdə, onun müəllifi olduğunuzu və ya yayımlamaq üçün hüququnuz olduğunu təsdiq edirsiniz. Göndərilən materialı redaktə etmək, qısaltmaq və saytda, eləcə də redaksiyanın sosial şəbəkə hesablarında dərc etmək hüququ Cənub Xəbərə verilir. Material dərc olunmaya da bilər.",
        ] },
        { h: "Reklam və xarici keçidlər", p: [
          "Saytda reklam, sponsorlu və ya tərəfdaş materiallar yerləşdirilə bilər; belə materiallar müvafiq qaydada qeyd olunur. Reklam verənlərin məzmununa görə redaksiya məsuliyyət daşımır.",
          "Saytdakı xarici saytlara keçidlər yalnız rahatlıq üçündür. Həmin saytların məzmununa, məxfilik qaydalarına və fəaliyyətinə nəzarət etmirik.",
        ] },
        { h: "Məsuliyyətin məhdudlaşdırılması", p: [
          "Sayt “olduğu kimi” təqdim olunur. Saytın fasiləsiz və xətasız işləməsinə, eləcə də saytdakı məlumatlardan istifadə nəticəsində yarana biləcək birbaşa və ya dolayı zərərlərə görə qanunvericiliklə icazə verilən həddə məsuliyyət daşımırıq.",
          "Texniki səbəblərə, planlı işlərə və ya üçüncü tərəf xidmətlərdəki nasazlıqlara görə sayta giriş müvəqqəti məhdudlaşa bilər.",
        ] },
        { h: "Düzəliş, cavab və etiraz hüququ", p: [
          "Saytda dərc olunan materialda qeyri-dəqiqlik olduğunu və ya hüquqlarınızın pozulduğunu düşünürsünüzsə, müraciətinizi əsaslandırılmış şəkildə bizə göndərin. Müraciət araşdırılacaq və əsaslı olduqda material düzəldiləcək, cavab hüququ təmin ediləcək və ya qanunvericiliyə uyğun digər tədbirlər görüləcək.",
        ] },
        { h: "Şəxsi məlumatlar", p: [
          "Şəxsi məlumatların emalı qaydaları Məxfilik siyasətində göstərilib və bu şərtlərin ayrılmaz hissəsidir.",
        ] },
        { h: "Tətbiq olunan hüquq", p: [
          "Bu şərtlər Azərbaycan Respublikasının qanunvericiliyinə uyğun tənzimlənir. Mübahisələr danışıqlar yolu ilə, razılıq əldə olunmadıqda isə Azərbaycan Respublikasının səlahiyyətli məhkəmələrində həll edilir.",
        ] },
        { h: "Əlaqə", p: [
          `Şərtlərlə bağlı suallar üçün: ${SITE_EMAIL}, ${SITE_PHONE}.`,
        ] },
      ]}
    />
  );
}
