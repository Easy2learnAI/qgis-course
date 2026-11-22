/* محتوى الدورة — Delta Conception
   العربية هي النص المرجعي (الحقول بدون لاحقة). الترجمات في الحقول ‎_en‎ و ‎_fr‎.
   مهم: ترتيب «steps» وعددها في كل وحدة يطابق مفاتيح guide.json المحمي (1، 2، 3…)؛
   لا تحذف بنداً ولا تغيّر ترتيبه إلا إذا عدّلت guide.json بالطريقة نفسها. */
window.COURSE = {
  guidePdf: "files.html",
  units: [
    {
      n: 0, slug: "welcome", area: null, kind: "intro",
      axis: "مرحباً بك في هذا التدريب",
      axis_en: "Welcome to the Training",
      axis_fr: "Bienvenue dans cette formation",
      exercise: null, exercise_en: null, exercise_fr: null,
      exTitle: "تقديم المقرر",
      exTitle_en: "Course Overview",
      exTitle_fr: "Présentation du cours",
      summary: "تقديم عام للمقرر ومنهجيته التطبيقية وأهدافه والفئة المستهدفة.",
      summary_en: "An overview of the course, its hands-on approach, its objectives and who it is for.",
      summary_fr: "Présentation générale du cours, de sa démarche pratique, de ses objectifs et de son public.",
      objectives: [
        "التعرّف على منهجية الدورة: كل مفهوم نظري يتبعه تطبيق عملي مباشر.",
        "معرفة الأهداف العامة ومخرجات التعلّم.",
        "الاطلاع على إعلانات الدورة وطريقة متابعتها."
      ],
      objectives_en: [
        "Understand the course method: every theoretical concept is followed directly by a hands-on application.",
        "Know the general objectives and learning outcomes.",
        "Read the course announcements and how to follow the course."
      ],
      objectives_fr: [
        "Comprendre la démarche du cours : chaque notion théorique est suivie d'une application pratique immédiate.",
        "Connaître les objectifs généraux et les acquis d'apprentissage.",
        "Prendre connaissance des annonces du cours et de son mode de suivi."
      ],
      steps: [
        { t: "تقديم المقرر", t_en: "Course presentation", t_fr: "Présentation du cours" },
        { t: "المنهجية التطبيقية والأهداف", t_en: "Hands-on method and objectives", t_fr: "Démarche pratique et objectifs" },
        { t: "الفئة المستهدفة", t_en: "Who the course is for", t_fr: "Public visé" },
        { t: "إعلانات الدورة", t_en: "Course announcements", t_fr: "Annonces du cours" }
      ],
      materials: [], tools: []
    },
    {
      n: 1, slug: "intro-qgis", area: null, kind: "setup",
      axis: "مقدمة في نظم المعلومات الجغرافية وبرنامج QGIS",
      axis_en: "Introduction to GIS and QGIS",
      axis_fr: "Introduction aux SIG et à QGIS",
      exercise: "تمرين 1", exercise_en: "Exercise 1", exercise_fr: "Exercice 1",
      exTitle: "مقدمة تطبيقية لبرنامج QGIS — التثبيت، الواجهة، والقواعد التشغيلية",
      exTitle_en: "Hands-on introduction to QGIS — installation, interface and basic rules",
      exTitle_fr: "Prise en main de QGIS — installation, interface et règles de base",
      summary: "تثبيت البرنامج، التعرّف على واجهته، إضافة أول طبقات البيانات وفهم الإسقاط.",
      summary_en: "Install the software, learn its interface, add your first data layers and understand projections.",
      summary_fr: "Installer le logiciel, découvrir son interface, ajouter les premières couches et comprendre la projection.",
      objectives: [
        "تثبيت QGIS وتكوين إعدادات البرنامج وفقاً لتفضيلاتك.",
        "التعرّف على واجهة البرنامج وأدواته وتطبيقاته العامة.",
        "إضافة طبقات البيانات إلى البرنامج وفحص البيانات الوصفية (Métadonnées).",
        "معرفة مبادئ إسقاط البيانات وإعادة إسقاط الطبقة.",
        "تثبيت أو تفعيل الإضافات (Extensions).",
        "معرفة روابط التوثيق وموارد تعلّم QGIS."
      ],
      objectives_en: [
        "Install QGIS and configure its settings to your preferences.",
        "Get to know the interface, its tools and general uses.",
        "Add data layers and inspect their metadata.",
        "Understand data projection principles and how to reproject a layer.",
        "Install or enable plugins.",
        "Know the documentation links and QGIS learning resources."
      ],
      objectives_fr: [
        "Installer QGIS et configurer le logiciel selon vos préférences.",
        "Découvrir l'interface, ses outils et ses usages généraux.",
        "Ajouter des couches de données et consulter les métadonnées.",
        "Comprendre les principes de projection et reprojeter une couche.",
        "Installer ou activer des extensions.",
        "Connaître la documentation et les ressources d'apprentissage de QGIS."
      ],
      steps: [
        { t: "مقدمة", t_en: "Introduction", t_fr: "Introduction" },
        { t: "الجزء النظري", t_en: "Theory", t_fr: "Partie théorique" },
        { t: "أهداف التعلّم", t_en: "Learning objectives", t_fr: "Objectifs d'apprentissage" },
        { t: "تحميل QGIS", t_en: "Downloading QGIS", t_fr: "Télécharger QGIS" },
        { t: "تشغيل QGIS", t_en: "Launching QGIS", t_fr: "Lancer QGIS" },
        { t: "إضافة البيانات", t_en: "Adding data", t_fr: "Ajouter des données" },
        { t: "تعريف مشروع QGIS", t_en: "Setting up a QGIS project", t_fr: "Définir un projet QGIS" },
        { t: "الإسقاط اللحظي", t_en: "On-the-fly reprojection", t_fr: "Reprojection à la volée" }
      ],
      materials: [], tools: ["QGIS"]
    },
    {
      n: 2, slug: "georeferencing", area: "bejaia", kind: "georef",
      axis: "الإرجاع الجغرافي وأنظمة الإسقاط",
      axis_en: "Georeferencing and Projection Systems",
      axis_fr: "Géoréférencement et systèmes de projection",
      exercise: "تمرين 2", exercise_en: "Exercise 2", exercise_fr: "Exercice 2",
      exTitle: "عملية الإرجاع الجغرافي والرقمنة لخرائط الأرشيف",
      exTitle_en: "Georeferencing and digitizing archive maps",
      exTitle_fr: "Géoréférencement et numérisation de cartes d'archives",
      summary: "إسناد خريطة طوبوغرافية قديمة لبجاية (USGS 1956) ثم رقمنة قممها وأنهارها وسبختها.",
      summary_en: "Georeference an old topographic map of Béjaïa (USGS 1956), then digitize its peaks, rivers and sebkha.",
      summary_fr: "Caler une ancienne carte topographique de Béjaïa (USGS 1956), puis numériser ses sommets, cours d'eau et sebkha.",
      objectives: [
        "إجراء الإرجاع الجغرافي لخريطة طوبوغرافية ممسوحة ضوئياً لمنطقة بجاية (USGS, 1956).",
        "التحقق من جودة الإرجاع الجغرافي.",
        "ضبط مسقط المشروع في QGIS.",
        "استخدام خريطة ويب كمرجع للتحقق.",
        "رقمنة عدة معالم جغرافية: قمم (نقاط)، أنهار (خطوط)، سبخة (مضلّع).",
        "هيكلة البيانات في قاعدة بيانات مكانية من نوع GeoPackage."
      ],
      objectives_en: [
        "Georeference a scanned topographic map of the Béjaïa area (USGS, 1956).",
        "Check the quality of the georeferencing.",
        "Set the project projection in QGIS.",
        "Use a web map as a reference for checking.",
        "Digitize several features: peaks (points), rivers (lines), sebkha (polygon).",
        "Structure the data in a GeoPackage spatial database."
      ],
      objectives_fr: [
        "Géoréférencer une carte topographique numérisée de la région de Béjaïa (USGS, 1956).",
        "Vérifier la qualité du géoréférencement.",
        "Définir la projection du projet dans QGIS.",
        "Utiliser une carte web comme référence de contrôle.",
        "Numériser plusieurs entités : sommets (points), cours d'eau (lignes), sebkha (polygone).",
        "Structurer les données dans une base de données spatiale GeoPackage."
      ],
      steps: [
        { t: "مقدمة", t_en: "Introduction", t_fr: "Introduction" },
        { t: "الجزء النظري", t_en: "Theory", t_fr: "Partie théorique" },
        { t: "الإرجاع الجغرافي انطلاقاً من شبكة الإحداثيات المطبوعة",
          t_en: "Georeferencing from the printed coordinate grid",
          t_fr: "Géoréférencement à partir du carroyage imprimé",
          sub: ["ملف المعايرة واختيار المساقط", "تفعيل ملحق الإرجاع الجغرافي", "استيراد الخريطة الممسوحة إلى Georeferencer GDAL", "ضبط إعدادات التحويل", "إضافة نقاط التحكم الأرضية (GCP)، تقليل الأخطاء وإجراء التحويل", "التحقق من الخريطة المرجعة جغرافياً"],
          sub_en: ["Calibration file and choice of projections", "Enabling the Georeferencer", "Loading the scanned map into the GDAL Georeferencer", "Setting the transformation options", "Adding ground control points (GCP), reducing errors and running the transformation", "Checking the georeferenced map"],
          sub_fr: ["Fichier de calage et choix des projections", "Activer le Géoréférenceur", "Charger la carte numérisée dans le Géoréférenceur GDAL", "Régler les paramètres de transformation", "Ajouter des points de contrôle (GCP), réduire les erreurs et lancer la transformation", "Vérifier la carte géoréférencée"] },
        { t: "أهداف التمرين", t_en: "Exercise objectives", t_fr: "Objectifs de l'exercice" },
        { t: "الإرجاع الجغرافي من صورة إلى صورة (اختياري)", t_en: "Image-to-image georeferencing (optional)", t_fr: "Géoréférencement image à image (facultatif)" },
        { t: "رقمنة الطبقات الاتجاهية من خريطة خلفية مرجعة جغرافياً",
          t_en: "Digitizing vector layers over a georeferenced background map",
          t_fr: "Numériser des couches vecteur sur un fond de carte géoréférencé",
          sub: ["رقمنة القمم", "رقمنة الأنهار", "رقمنة السبخة"],
          sub_en: ["Digitizing the peaks", "Digitizing the rivers", "Digitizing the sebkha"],
          sub_fr: ["Numériser les sommets", "Numériser les cours d'eau", "Numériser la sebkha"] }
      ],
      materials: [], tools: ["QGIS", "Georeferencer GDAL", "GeoPackage"]
    },
    {
      n: 3, slug: "vector", area: "eloued", kind: "vector",
      axis: "بيانات اتجاهية وعمليات مكانية",
      axis_en: "Vector Data and Spatial Operations",
      axis_fr: "Données vecteur et opérations spatiales",
      exercise: "تمرين 3أ", exercise_en: "Exercise 3A", exercise_fr: "Exercice 3A",
      exTitle: "معالجة البيانات الاتجاهية واستيفاء منسوب المياه الجوفية في الوادي (وادي سوف)",
      exTitle_en: "Vector processing and groundwater level interpolation in El Oued (Oued Souf)",
      exTitle_fr: "Traitement vecteur et interpolation du niveau de la nappe à El Oued (Oued Souf)",
      summary: "من جدول قياسات الآبار إلى خريطة لمنسوب المياه الجوفية وخطوط الكنتور.",
      summary_en: "From a table of well measurements to a groundwater level map with contour lines.",
      summary_fr: "D'un tableau de mesures de puits à une carte du niveau de la nappe et ses courbes.",
      objectives: [
        "استيراد الجداول إلى برنامج QGIS (التحوّل من صيغة جدول إلى تنسيق نظام المعلومات الجغرافية).",
        "ربط جدول البيانات بطبقة اتجاهية (Vector) تضم مواقع الآبار.",
        "إعادة حساب القيم في جدول الخصائص (Attribute Table).",
        "استيفاء النقاط لتحويلها إلى نموذج شبكي (Raster).",
        "استخراج خطوط الكنتور."
      ],
      objectives_en: [
        "Import tables into QGIS (from a spreadsheet format to a GIS format).",
        "Join the data table to a vector layer of well locations.",
        "Recalculate values in the attribute table.",
        "Interpolate the points into a raster surface.",
        "Extract contour lines."
      ],
      objectives_fr: [
        "Importer des tableaux dans QGIS (passer d'un format tableur à un format SIG).",
        "Joindre le tableau de données à une couche vecteur des puits.",
        "Recalculer des valeurs dans la table attributaire.",
        "Interpoler les points pour obtenir un raster.",
        "Extraire les courbes de niveau."
      ],
      steps: [
        { t: "مقدمة", t_en: "Introduction", t_fr: "Introduction" },
        { t: "الجزء النظري", t_en: "Theory", t_fr: "Partie théorique" },
        { t: "أهداف التعلّم", t_en: "Learning objectives", t_fr: "Objectifs d'apprentissage" },
        { t: "تحويل جدول CSV إلى صيغة نظم المعلومات الجغرافية (SIG)", t_en: "Converting a CSV table to a GIS layer", t_fr: "Convertir un tableau CSV en couche SIG" },
        { t: "ربط جداول الخصائص وحاسبة الحقول", t_en: "Table joins and the field calculator", t_fr: "Jointures et calculatrice de champ" },
        { t: "إنشاء نموذج شبكي من البيانات الاتجاهية (الاستيفاء)", t_en: "Creating a raster from vector data (interpolation)", t_fr: "Créer un raster à partir de données vecteur (interpolation)" }
      ],
      materials: [], tools: ["QGIS"]
    },
    {
      n: 4, slug: "raster", area: "blida-mountains", kind: "raster",
      axis: "معالجة البيانات الشبكية",
      axis_en: "Raster Data Processing",
      axis_fr: "Traitement des données raster",
      exercise: "تمرين 3ب", exercise_en: "Exercise 3B", exercise_fr: "Exercice 3B",
      exTitle: "معالجة البيانات الشبكية — تحديد المناطق المغطاة بالثلوج سنوياً في ولاية البليدة",
      exTitle_en: "Raster processing — mapping areas covered by snow each year in Blida province",
      exTitle_fr: "Traitement raster — délimiter les zones enneigées chaque année dans la wilaya de Blida",
      summary: "نماذج الارتفاع الرقمية، الحاسبة الشبكية والتحديد المكاني لمعرفة الطرق المعرّضة للثلوج.",
      summary_en: "Digital elevation models, the raster calculator and spatial selection to find the roads exposed to snow.",
      summary_fr: "Modèles numériques de terrain, calculatrice raster et sélection spatiale pour repérer les routes exposées à la neige.",
      objectives: [
        "تحميل نماذج الارتفاعات الرقمية (MNT أو DEM بالإنجليزية).",
        "إنشاء فسيفساء شبكية بناءً على عدة نماذج تضاريس رقمية.",
        "اقتطاع ملف شبكي حسب حدود منطقة.",
        "توليد التضاريس.",
        "استخدام الحاسبة الجبرية.",
        "استخراج خطوط الكنتور.",
        "تحديد البيانات حسب الموقع والتراكب."
      ],
      objectives_en: [
        "Download digital elevation models (DEM).",
        "Build a raster mosaic from several elevation models.",
        "Clip a raster to the boundary of an area.",
        "Generate terrain products.",
        "Use the raster calculator.",
        "Extract contour lines.",
        "Select data by location and overlay."
      ],
      objectives_fr: [
        "Télécharger des modèles numériques de terrain (MNT).",
        "Créer une mosaïque raster à partir de plusieurs MNT.",
        "Découper un raster selon les limites d'une zone.",
        "Générer les produits de relief.",
        "Utiliser la calculatrice raster.",
        "Extraire les courbes de niveau.",
        "Sélectionner des données par localisation et superposition."
      ],
      steps: [
        { t: "مقدمة", t_en: "Introduction", t_fr: "Introduction" },
        { t: "الجزء النظري", t_en: "Theory", t_fr: "Partie théorique" },
        { t: "أهداف التعلّم", t_en: "Learning objectives", t_fr: "Objectifs d'apprentissage" },
        { t: "تحميل نماذج الارتفاع الرقمية (Copernicus) ودمجها في فسيفساء", t_en: "Downloading elevation models (Copernicus) and merging them into a mosaic", t_fr: "Télécharger les MNT (Copernicus) et les assembler en mosaïque" },
        { t: "اقتطاع وعرض نماذج الارتفاعات الرقمية", t_en: "Clipping and displaying elevation models", t_fr: "Découper et afficher les MNT" },
        { t: "تصوير التضاريس: رسم الظلال وخطوط الكنتور", t_en: "Showing the terrain: hillshade and contour lines", t_fr: "Représenter le relief : ombrage et courbes de niveau" },
        { t: "استخدام الحاسبة الشبكية (Calculatrice Raster)", t_en: "Using the raster calculator", t_fr: "Utiliser la calculatrice raster" },
        { t: "تحويل البيانات الشبكية إلى بيانات اتجاهية واقتطاع نطاقات الارتفاعات", t_en: "Converting raster to vector and extracting elevation bands", t_fr: "Convertir le raster en vecteur et extraire les tranches d'altitude" },
        { t: "تحديد مكاني واستخراج الطرق المتقاطعة مع منطقة الثلوج", t_en: "Spatial selection: extracting the roads that cross the snow zone", t_fr: "Sélection spatiale : extraire les routes qui traversent la zone enneigée" }
      ],
      materials: [], tools: ["QGIS", "Copernicus DEM", "SRTM Downloader"]
    },
    {
      n: 5, slug: "cartography", area: null, kind: "layout",
      axis: "أسس التمثيل الخرائطي",
      axis_en: "Cartographic Representation",
      axis_fr: "Bases de la représentation cartographique",
      exercise: "تمرين 4", exercise_en: "Exercise 4", exercise_fr: "Exercice 4",
      exTitle: "نمط وتصميم الخرائط",
      exTitle_en: "Map styling and design",
      exTitle_fr: "Style et mise en page des cartes",
      summary: "ترميز الطبقات، تظليل التضاريس، ثم إخراج خريطة كاملة بعنوانها ومفتاحها ومقياسها.",
      summary_en: "Layer symbology and hillshading, then a complete map with its title, legend and scale.",
      summary_fr: "Symbologie des couches et ombrage du relief, puis une carte complète avec titre, légende et échelle.",
      objectives: [
        "فهم أهمية تنسيق الجيوباكج (GeoPackage) لتنظيم البيانات.",
        "ترميز الطبقات الاتجاهية (نقاط، خطوط، مضلّعات).",
        "تطبيق ترميز ملائم للبيانات الشبكية (ألوان زائفة، تظليل التضاريس، الشفافية، الدمج).",
        "استخدام لوحات ألوان متخصصة لضمان تمثيل ملائم.",
        "إنشاء تأثير تظليل التضاريس (Hillshade) لتحسين تصوّر التضاريس.",
        "اعتماد أسس الترميز البصري في تمثيل البيانات.",
        "تصميم خريطة متكاملة تتضمن عناصر الخريطة الأساسية (العنوان، مفتاح الرموز، مقياس الرسم، اتجاه الشمال، المصادر)."
      ],
      objectives_en: [
        "Understand why the GeoPackage format matters for organizing data.",
        "Symbolize vector layers (points, lines, polygons).",
        "Apply suitable raster symbology (pseudocolor, hillshade, transparency, blending).",
        "Use dedicated colour palettes for a sound representation.",
        "Create a hillshade effect to improve how the terrain reads.",
        "Apply the principles of visual variables when representing data.",
        "Design a complete map with its essential elements (title, legend, scale bar, north arrow, sources)."
      ],
      objectives_fr: [
        "Comprendre l'intérêt du format GeoPackage pour organiser les données.",
        "Symboliser les couches vecteur (points, lignes, polygones).",
        "Appliquer une symbologie adaptée aux rasters (pseudo-couleur, ombrage, transparence, fusion).",
        "Utiliser des palettes de couleurs spécialisées pour une représentation adaptée.",
        "Créer un ombrage (Hillshade) pour mieux percevoir le relief.",
        "Appliquer les règles de la sémiologie graphique.",
        "Réaliser une carte complète avec ses éléments essentiels (titre, légende, échelle, flèche du nord, sources)."
      ],
      steps: [
        { t: "مقدمة", t_en: "Introduction", t_fr: "Introduction" },
        { t: "الجزء النظري", t_en: "Theory", t_fr: "Partie théorique" },
        { t: "أهداف التعلّم", t_en: "Learning objectives", t_fr: "Objectifs d'apprentissage" },
        { t: "نمط الطبقات الاتجاهية", t_en: "Styling vector layers", t_fr: "Style des couches vecteur" },
        { t: "حفظ وتصدير وتحميل أنماط الطبقات", t_en: "Saving, exporting and loading layer styles", t_fr: "Enregistrer, exporter et charger des styles" },
        { t: "نمط الخريطة باستخدام الملفات الشبكية (Raster)",
          t_en: "Styling the map with raster files",
          t_fr: "Style de la carte avec des fichiers raster",
          sub: ["تخصيص نمط لملف شبكي", "توليد تأثير التظليل (Hillshading)"],
          sub_en: ["Customizing a raster style", "Generating a hillshade effect"],
          sub_fr: ["Personnaliser le style d'un raster", "Générer un ombrage"] },
        { t: "تصميم خريطة",
          t_en: "Designing a map",
          t_fr: "Concevoir une carte",
          sub: ["إعدادات مصمّم الطباعة", "إنهاء وتصدير"],
          sub_en: ["Print layout settings", "Finishing and exporting"],
          sub_fr: ["Paramètres de la mise en page", "Finaliser et exporter"] }
      ],
      materials: [], tools: ["QGIS", "GeoPackage"]
    },
    {
      n: 6, slug: "extras", area: null, kind: "extras",
      axis: "عناصر إضافية",
      axis_en: "Additional Tools",
      axis_fr: "Compléments",
      exercise: null, exercise_en: null, exercise_fr: null,
      exTitle: "OpenStreetMap و Google Earth",
      exTitle_en: "OpenStreetMap and Google Earth",
      exTitle_fr: "OpenStreetMap et Google Earth",
      summary: "جلب بيانات OpenStreetMap المفتوحة، وتصدير طبقات مشروعك لعرضها في Google Earth.",
      summary_en: "Get open OpenStreetMap data and export your project layers to view them in Google Earth.",
      summary_fr: "Récupérer des données ouvertes OpenStreetMap et exporter vos couches pour les afficher dans Google Earth.",
      objectives: [
        "استخدام بيانات الوصول المفتوح OpenStreetMap داخل QGIS.",
        "تصدير الملفات إلى Google Earth (صيغة KML/KMZ) لعرضها ومشاركتها."
      ],
      objectives_en: [
        "Use open-access OpenStreetMap data in QGIS.",
        "Export files to Google Earth (KML/KMZ) to view and share them."
      ],
      objectives_fr: [
        "Utiliser les données ouvertes OpenStreetMap dans QGIS.",
        "Exporter des fichiers vers Google Earth (KML/KMZ) pour les afficher et les partager."
      ],
      steps: [
        { t: "استخدام بيانات الوصول المفتوح OpenStreetMap", t_en: "Using open OpenStreetMap data", t_fr: "Utiliser les données ouvertes OpenStreetMap" },
        { t: "تصدير الملفات إلى Google Earth", t_en: "Exporting files to Google Earth", t_fr: "Exporter des fichiers vers Google Earth" }
      ],
      materials: [], tools: ["QGIS", "OpenStreetMap", "Google Earth Pro"]
    }
  ],

  areas: {
    "bejaia": {
      name: "بجاية — الشريط الساحلي", name_en: "Béjaïa — coastal strip", name_fr: "Béjaïa — bande côtière",
      ll: [36.75, 5.06],
      ex: "تمرين 2", ex_en: "Exercise 2", ex_fr: "Exercice 2",
      what: "خريطة طوبوغرافية أرشيفية (USGS 1956) تُسند جغرافياً ثم تُرقمن.",
      what_en: "An archive topographic map (USGS 1956), georeferenced and then digitized.",
      what_fr: "Une carte topographique d'archive (USGS 1956), géoréférencée puis numérisée."
    },
    "blida-mountains": {
      name: "مرتفعات ولاية البليدة (الشريعة)", name_en: "Blida highlands (Chréa)", name_fr: "Hauteurs de Blida (Chréa)",
      ll: [36.43, 2.88],
      ex: "تمرين 3ب", ex_en: "Exercise 3B", ex_fr: "Exercice 3B",
      what: "نموذج ارتفاع رقمي (Copernicus 30 م) لتحديد المناطق التي تغطيها الثلوج سنوياً والطرق التي تعبرها.",
      what_en: "A digital elevation model (Copernicus 30 m) to map the areas covered by snow each year and the roads that cross them.",
      what_fr: "Un modèle numérique de terrain (Copernicus 30 m) pour délimiter les zones enneigées chaque année et les routes qui les traversent."
    },
    "eloued": {
      name: "الوادي — وادي سوف", name_en: "El Oued — Oued Souf", name_fr: "El Oued — Oued Souf",
      ll: [33.37, 6.86],
      ex: "تمرين 3أ", ex_en: "Exercise 3A", ex_fr: "Exercice 3A",
      what: "قياسات آبار (بيانات تدريبية) تُستوفى لرسم خريطة منسوب المياه الجوفية.",
      what_en: "Well measurements (training data) interpolated into a groundwater level map.",
      what_fr: "Des mesures de puits (données d'entraînement) interpolées en carte du niveau de la nappe."
    }
  },

  objectives: [
    { t: "تثبيت وإعداد برنامج QGIS.", t_en: "Install and set up QGIS.", t_fr: "Installer et configurer QGIS.", sym: "setup" },
    { t: "فهم ومعالجة البيانات الاتجاهية والشبكية.", t_en: "Understand and process vector and raster data.", t_fr: "Comprendre et traiter les données vecteur et raster.", sym: "vector" },
    { t: "إدارة نظم الإحداثيات والمساقط.", t_en: "Manage coordinate systems and projections.", t_fr: "Gérer les systèmes de coordonnées et les projections.", sym: "crs" },
    { t: "الإرجاع الجغرافي لخريطة ممسوحة ضوئياً.", t_en: "Georeference a scanned map.", t_fr: "Géoréférencer une carte numérisée.", sym: "gcp" },
    { t: "تنسيق الطبقات وتطبيق قواعد الترميز البصري.", t_en: "Style layers and apply the rules of visual symbology.", t_fr: "Styliser les couches et appliquer les règles de la sémiologie graphique.", sym: "style" },
    { t: "إجراء عمليات مكانية: الاقتطاع، التحديد، والتحويل بين البيانات الشبكية والاتجاهية.", t_en: "Run spatial operations: clipping, selection and raster–vector conversion.", t_fr: "Réaliser des opérations spatiales : découpage, sélection et conversion raster–vecteur.", sym: "raster" },
    { t: "تصميم خريطة متكاملة جاهزة للتصدير.", t_en: "Design a complete map ready for export.", t_fr: "Concevoir une carte complète prête à l'export.", sym: "layout" }
  ],

  tools: [
    { name: "QGIS", url: "https://qgis.org/download/",
      role: "البرنامج الرئيسي للدورة: عرض البيانات وتحليلها وتصميم الخرائط.",
      role_en: "The main course software: viewing and analysing data and designing maps.",
      role_fr: "Le logiciel principal du cours : visualiser et analyser les données, concevoir les cartes.",
      price: "مجاني ومفتوح المصدر", price_en: "Free, open source", price_fr: "Gratuit, open source" },
    { name: "Google Earth Pro", url: "https://www.google.com/earth/about/versions/",
      role: "عرض طبقات المشروع المصدَّرة بصيغة KML/KMZ ومشاركتها.",
      role_en: "Viewing and sharing project layers exported as KML/KMZ.",
      role_fr: "Afficher et partager les couches du projet exportées en KML/KMZ.",
      price: "مجاني", price_en: "Free", price_fr: "Gratuit" },
    { name: "OpenStreetMap", url: "https://www.openstreetmap.org",
      role: "بيانات جغرافية مفتوحة: طرق، مبانٍ، أودية…",
      role_en: "Open geographic data: roads, buildings, wadis…",
      role_fr: "Données géographiques ouvertes : routes, bâtiments, oueds…",
      price: "بيانات مفتوحة", price_en: "Open data", price_fr: "Données ouvertes" },
    { name: "SRTM Downloader", url: "https://plugins.qgis.org/plugins/SRTM-Downloader/",
      role: "إضافة QGIS لتنزيل نماذج الارتفاع الرقمية.",
      role_en: "A QGIS plugin for downloading elevation models.",
      role_fr: "Extension QGIS pour télécharger des modèles numériques de terrain.",
      price: "إضافة مجانية", price_en: "Free plugin", price_fr: "Extension gratuite" },
    { name: "GeoPackage", url: "https://www.geopackage.org",
      role: "صيغة مفتوحة لحفظ طبقات المشروع في ملف واحد.",
      role_en: "An open format that stores all project layers in a single file.",
      role_fr: "Un format ouvert qui regroupe toutes les couches du projet dans un seul fichier.",
      price: "صيغة مفتوحة", price_en: "Open standard", price_fr: "Format ouvert" }
  ],

  // [العربية، الفرنسية، الإنجليزية]
  glossary: [
    ["نظم المعلومات الجغرافية", "SIG", "GIS"],
    ["طبقة", "Couche", "Layer"],
    ["بيانات اتجاهية", "Données vecteur", "Vector data"],
    ["بيانات شبكية", "Données raster", "Raster data"],
    ["نقطة / خط / مضلّع", "Point / Ligne / Polygone", "Point / Line / Polygon"],
    ["البيانات الوصفية", "Métadonnées", "Metadata"],
    ["جدول الخصائص", "Table attributaire", "Attribute table"],
    ["حاسبة الحقول", "Calculatrice de champ", "Field calculator"],
    ["ربط الجداول", "Jointure", "Join"],
    ["نظام الإحداثيات المرجعي", "Système de coordonnées de référence (SCR)", "Coordinate Reference System (CRS)"],
    ["الإسقاط", "Projection", "Projection"],
    ["الإسقاط اللحظي", "Reprojection à la volée", "On-the-fly reprojection"],
    ["الإرجاع الجغرافي", "Géoréférencement", "Georeferencing"],
    ["نقطة تحكم أرضية", "Point de contrôle (GCP)", "Ground Control Point (GCP)"],
    ["الرقمنة", "Numérisation", "Digitizing"],
    ["الاستيفاء", "Interpolation", "Interpolation"],
    ["خطوط الكنتور", "Courbes de niveau", "Contour lines"],
    ["نموذج الارتفاع الرقمي", "Modèle numérique de terrain (MNT)", "Digital Elevation Model (DEM)"],
    ["الفسيفساء", "Mosaïque", "Mosaic"],
    ["الاقتطاع", "Découpage", "Clip"],
    ["تظليل التضاريس", "Ombrage", "Hillshade"],
    ["الحاسبة الشبكية", "Calculatrice raster", "Raster calculator"],
    ["التحويل من شبكي إلى اتجاهي", "Polygonisation", "Polygonize"],
    ["التحديد حسب الموقع", "Sélection par localisation", "Select by location"],
    ["التقاطع", "Intersection", "Intersection"],
    ["الترميز", "Symbologie", "Symbology"],
    ["مفتاح الرموز", "Légende", "Legend"],
    ["مقياس الرسم", "Échelle", "Scale"],
    ["اتجاه الشمال", "Flèche du nord", "North arrow"],
    ["مصمّم الطباعة", "Mise en page", "Print layout"],
    ["الإضافات", "Extensions", "Plugins"],
    ["جيوباكج", "GeoPackage", "GeoPackage"],
    ["ملف KML", "KML / KMZ", "KML / KMZ"]
  ],

  faq: [
    { q: "هل أحتاج خبرة سابقة في نظم المعلومات الجغرافية؟",
      q_en: "Do I need previous GIS experience?",
      q_fr: "Faut-il une expérience préalable en SIG ?",
      a: "لا. الدورة تأسيسية وتبدأ من تثبيت البرنامج والتعرّف على واجهته، ثم تتدرّج تمريناً بعد تمرين.",
      a_en: "No. This is a foundation course: it starts with installing the software and learning its interface, then builds up one exercise at a time.",
      a_fr: "Non. Le cours est une initiation : il commence par l'installation du logiciel et la découverte de son interface, puis progresse exercice après exercice." },
    { q: "ما البرامج التي سأحتاجها؟",
      q_en: "Which software will I need?",
      q_fr: "De quels logiciels aurai-je besoin ?",
      a: "QGIS للعمل في كل الوحدات، و Google Earth Pro للوحدة الأخيرة. كلاهما مجاني ويعمل على Windows و macOS و Linux.",
      a_en: "QGIS for every module, and Google Earth Pro for the last one. Both are free and run on Windows, macOS and Linux.",
      a_fr: "QGIS pour tous les modules, et Google Earth Pro pour le dernier. Les deux sont gratuits et fonctionnent sous Windows, macOS et Linux." },
    { q: "أي نسخة من QGIS أثبّت؟",
      q_en: "Which version of QGIS should I install?",
      q_fr: "Quelle version de QGIS installer ?",
      a: "يُنصح بالنسخة طويلة الدعم (LTR) لأنها الأكثر استقراراً. ستجد رابط التحميل في صفحة الموارد.",
      a_en: "The Long Term Release (LTR) is recommended because it is the most stable. The download link is on the Resources page.",
      a_fr: "La version à support long terme (LTR) est recommandée car c'est la plus stable. Le lien de téléchargement est sur la page Ressources." },
    { q: "هل يوجد دليل مكتوب للتمارين؟",
      q_en: "Is there a written guide for the exercises?",
      q_fr: "Existe-t-il un guide écrit des exercices ?",
      a: "نعم. في صفحة كل وحدة، اضغط «طريقة التنفيذ» تحت أي بند لعرض خطواته داخل QGIS. ويمكن للمتدرّبين المسجَّلين تحميل الدليل كاملاً بصيغة PDF من صفحة «ملفات الدورة» بالحساب الذي يرسله المدرّب.",
      a_en: "Yes. On each module page, click “How to do it” under any item to see its steps in QGIS. Registered trainees can also download the full guide as a PDF from the “My Files” page, using the account the trainer sends them. The detailed guide is written in Arabic.",
      a_fr: "Oui. Sur la page de chaque module, cliquez sur « Méthode » sous un point pour voir ses étapes dans QGIS. Les stagiaires inscrits peuvent aussi télécharger le guide complet en PDF depuis la page « Mes fichiers », avec le compte envoyé par le formateur. Le guide détaillé est rédigé en arabe." },
    { q: "كيف أحصل على حساب لتحميل ملفات الدورة؟",
      q_en: "How do I get an account to download the course files?",
      q_fr: "Comment obtenir un compte pour télécharger les fichiers du cours ?",
      a: "بعد قبول طلب التسجيل يُنشئ المدرّب حسابك ويرسل لك البريد وكلمة مرور مؤقتة. ادخل بهما في صفحة «ملفات الدورة» لتحميل الدليل ومواد التمارين، ويمكنك تغيير كلمة المرور بعد الدخول.",
      a_en: "Once your registration is accepted, the trainer creates your account and sends you the email and a temporary password. Sign in with them on the “My Files” page to download the guide and exercise materials; you can change the password after signing in.",
      a_fr: "Une fois votre inscription acceptée, le formateur crée votre compte et vous envoie l'e-mail et un mot de passe provisoire. Connectez-vous sur la page « Mes fichiers » pour télécharger le guide et les supports d’exercices ; vous pourrez changer le mot de passe ensuite." }
  ],

  /* ---------- أدوات الترجمة ---------- */
  // يعيد قيمة الحقل باللغة المطلوبة، أو النص العربي المرجعي إذا لم تتوفر ترجمة
  pick: function (o, field, lang) {
    if (!o) return '';
    var l = lang || (window.I18N && window.I18N.getLang()) || 'ar';
    if (l !== 'ar') { var v = o[field + '_' + l]; if (v != null && v !== '') return v; }
    return o[field];
  },
  getLocalizedUnit: function (u, lang) {
    if (!u) return u;
    var p = this.pick, l = lang;
    return {
      n: u.n, slug: u.slug, area: u.area, kind: u.kind,
      axis: p(u, 'axis', l), exercise: p(u, 'exercise', l), exTitle: p(u, 'exTitle', l),
      summary: p(u, 'summary', l), objectives: p(u, 'objectives', l),
      steps: (u.steps || []).map(function (s) { return { t: p(s, 't', l), sub: s.sub ? p(s, 'sub', l) : null }; }),
      materials: u.materials || [], tools: u.tools || []
    };
  },
  getLocalizedArea: function (key, lang) {
    var a = this.areas[key];
    if (!a) return null;
    return { name: this.pick(a, 'name', lang), ll: a.ll, ex: this.pick(a, 'ex', lang), what: this.pick(a, 'what', lang) };
  },
  getLocalizedObjective: function (o, lang) { return o && { t: this.pick(o, 't', lang), sym: o.sym }; },
  getLocalizedTool: function (t, lang) {
    return t && { name: t.name, url: t.url, role: this.pick(t, 'role', lang), price: this.pick(t, 'price', lang) };
  },
  getLocalizedFaq: function (lang) {
    var p = this.pick;
    return this.faq.map(function (f) { return { q: p(f, 'q', lang), a: p(f, 'a', lang) }; });
  }
};
