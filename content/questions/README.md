# Sorular / Questions

Bu klasördeki her dosya, sitede **kendi sayfası olan bir soru-cevap** üretir. Yeni bir soru eklemek
için kod bilmek gerekmez: GitHub'da bu klasörde **Add file → Create new file** deyip aşağıdaki
şablonu doldurmanız yeterlidir. Değişikliği kaydettikten birkaç dakika sonra sayfa yayına girer.

> The repository language is English; this one file is Turkish because the attorney writes the
> questions. The schema itself lives in `src/content.config.ts`.

## Dosya adı = adres

Dosya adı, sayfanın adresi olur. Küçük harf, Türkçe karakter yok, kelimeler arası tire:

    vekaletname-nasil-cikarilir.yml   →   kobya.av.tr/sorular/vekaletname-nasil-cikarilir/

## Şablon

```yaml
question: Vekaletname nasıl çıkarılır?
summary: Arama sonuçlarında ve liste sayfasında görünen bir-iki cümlelik özet.
date: 2026-09-24
tags:
  - vekaletname
  - süreç
answer: |
  Boş satır bırakarak yeni paragraf açılır.

  Madde listesi için satır başına tire koyun:

  - birinci madde
  - ikinci madde

  Bir kelimeyi *yıldız içine* alırsanız vurgulu (italik, bronz) görünür. Bağlantı için
  [bağlantı metni](https://www.mevzuat.gov.tr) yazabilirsiniz.
```

Zorunlu alanlar: `question`, `summary`, `date`, `answer`. Diğerleri isteğe bağlıdır:

| Alan       | Ne işe yarar                                                                          |
| ---------- | ------------------------------------------------------------------------------------- |
| `tags`     | Sayfanın altındaki etiketler; aynı etiketi taşıyan sorular birbirine bağlanır.        |
| `image`    | `images/` klasörüne koyduğunuz görsel, örn. `images/vekaletname.jpg`.                  |
| `imageAlt` | Görselin kısa açıklaması. Görsel eklediyseniz **zorunludur** (görme engelliler + SEO). |
| `contact`  | `false` yazarsanız o sayfanın sonundaki iletişim bölümü görünmez. Varsayılan `true`.   |
| `draft`    | `true` yazarsanız soru yayına girmez; yazmaya devam ederken kullanın.                  |
| `en`       | İngilizce çeviri. Yazılmazsa soru yalnızca Türkçe yayınlanır.                          |

## İngilizcesi

`en:` bloğunu eklerseniz soru İngilizce sayfada da yayınlanır. Eklemezseniz İngilizce listede
"bu sorunun cevabı yalnızca Türkçe" notuyla görünür ve Türkçe sayfaya bağlanır.

```yaml
en:
  question: How is a power of attorney issued?
  summary: One or two sentences in English.
  answer: |
    Aynı yazım kuralları geçerlidir.
  tags:
    - power-of-attorney
  slug: how-is-a-power-of-attorney-issued   # isteğe bağlı; yazılmazsa Türkçe adres kullanılır
```

## Reklam yasağı

Avukatlık Kanunu m. 55 ve TBB Reklam Yasağı Yönetmeliği gereği metinler **yalnızca bilgilendirici**
olmalıdır. "En iyi", "uzman", "lider" gibi nitelemeler, başarı oranı, kazanılmış dava örnekleri,
müvekkil isimleri, ücret bilgisi ve "ücretsiz görüşme" ifadeleri kullanılamaz. Somut bir olaya
ilişkin tavsiye yerine, genel ve bilgilendirici anlatım tercih edilir.
