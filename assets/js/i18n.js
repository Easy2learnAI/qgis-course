/* نظام تعدد اللغات الشامل لمنصة Delta Conception
   يدعم: العربية (ar - RTL)، الإنجليزية (en - LTR)، الفرنسية (fr - LTR) */
(function () {
  var LANG_KEY = 'delta_lang';

  var DICT = {
    // Navigation
    nav_home: { ar: 'الرئيسية', en: 'Home', fr: 'Accueil' },
    nav_courses: { ar: 'الدورات التدريبية', en: 'Training Courses', fr: 'Formations' },
    nav_books: { ar: 'مكتبة الكتب', en: 'Digital Library', fr: 'Bibliothèque' },
    nav_resources: { ar: 'الموارد والمعجم', en: 'Resources & Glossary', fr: 'Ressources & Glossaire' },
    nav_files: { ar: 'ملفاتي وحسابي', en: 'My Files & Account', fr: 'Mes Fichiers & Compte' },
    nav_join: { ar: 'انضم للمنصة', en: 'Join', fr: 'S’inscrire' },
    nav_skip: { ar: 'انتقل إلى المحتوى', en: 'Skip to content', fr: 'Aller au contenu' },
    nav_menu: { ar: 'القائمة', en: 'Menu', fr: 'Menu' },

    // Brand
    brand_subtitle: {
      ar: 'أكاديمية الدورات والمكتبة الرقمية',
      en: 'Training Academy & Digital Library',
      fr: 'Académie de Formation & Bibliothèque Numérique'
    },

    // Hero on Home
    hero_badge: {
      ar: 'أكاديمية Delta Conception والمكتبة الرقمية',
      en: 'Delta Conception Academy & Digital Library',
      fr: 'Académie Delta Conception & Bibliothèque Numérique'
    },
    hero_title: {
      ar: 'من خريطة ورقية ممسوحة إلى مشروع SIG متكامل',
      en: 'From a Scanned Paper Map to a Full GIS Project',
      fr: "D'une carte papier numérisée à un projet SIG complet"
    },
    hero_desc: {
      ar: 'منصة تدريبية في نظم المعلومات الجغرافية بـ QGIS و Google Earth على بيانات حقيقية من الجزائر، مع مكتبة رقمية للكتب والمراجع.',
      en: 'A training platform in GIS with QGIS and Google Earth on real data from Algeria, with a digital library of books and references.',
      fr: 'Une plateforme de formation aux SIG avec QGIS et Google Earth sur des données réelles d’Algérie, avec une bibliothèque numérique de livres et de références.'
    },
    hero_btn_courses: {
      ar: 'استكشف جميع الدورات',
      en: 'Explore All Courses',
      fr: 'Explorer toutes les formations'
    },
    hero_btn_books: {
      ar: 'مكتبة الكتب الرقمية',
      en: 'Digital Books Library',
      fr: 'Bibliothèque Numérique'
    },
    hero_btn_qgis: {
      ar: 'دورة QGIS المتاحة الآن ↓',
      en: 'Current QGIS Course ↓',
      fr: 'Formation QGIS en cours ↓'
    },

    // Interactive Map Sheet & Layers
    layer_title: { ar: 'الطبقات', en: 'Map Layers', fr: 'Couches' },
    layer_replay: { ar: 'إعادة', en: 'Replay', fr: 'Rejouer' },
    layer_peaks: { ar: 'القمم', en: 'Peaks', fr: 'Sommets' },
    layer_rivers: { ar: 'الأنهار', en: 'Rivers', fr: 'Rivières' },
    layer_sebkha: { ar: 'السبخة', en: 'Wetland', fr: 'Sebkha' },
    layer_contours: { ar: 'الكنتور', en: 'Contours', fr: 'Courbes' },
    layer_hillshade: { ar: 'التظليل', en: 'Hillshade', fr: 'Ombrage' },
    layer_dem: { ar: 'الارتفاعات', en: 'Elevation', fr: 'Relief (MNT)' },
    sheet_idle: {
      ar: 'حرّك المؤشر فوق الخريطة لقراءة الإحداثيات',
      en: 'Hover cursor over map to inspect coordinates',
      fr: 'Survolez la carte pour lire les coordonnées'
    },
    sheet_s0: {
      ar: 'خريطة ممسوحة ضوئياً — بدون إسناد جغرافي',
      en: 'Scanned paper map — unreferenced scan',
      fr: 'Carte papier numérisée — non calée'
    },
    sheet_s1: {
      ar: 'إضافة نقاط التحكم الأرضية ',
      en: 'Adding Ground Control Points (GCP) ',
      fr: 'Ajout des points de calage (GCP) '
    },
    sheet_s2: {
      ar: 'تحويل الخريطة إلى الإحداثيات الحقيقية…',
      en: 'Transforming map to real-world coordinates...',
      fr: 'Transformation vers les coordonnées réelles...'
    },
    sheet_s3: {
      ar: 'تم الإرجاع الجغرافي — RMS = 0.42 بكسل',
      en: 'Georeferencing complete — RMS = 0.42 px',
      fr: 'Géoréférencement réussi — RMS = 0.42 px'
    },
    sheet_s4: {
      ar: 'الرقمنة: قمم (نقاط)، أنهار (خطوط)، سبخة (مضلّع)',
      en: 'Digitizing: Peaks (points), Rivers (lines), Wetland (polygon)',
      fr: 'Numérisation : Sommets (points), Rivières (lignes), Sebkha (polygone)'
    },

    // Sections on Home
    home_courses_h2: {
      ar: 'دورات ومسارات الأكاديمية',
      en: 'Academy Courses & Learning Paths',
      fr: "Formations & Parcours de l'Académie"
    },
    home_courses_lede: {
      ar: 'دورات تطبيقية على بيانات ومشاريع حقيقية. تُضاف دورات جديدة هنا عند افتتاحها.',
      en: 'Hands-on courses on real data and projects. New courses are added here as they open.',
      fr: 'Des formations pratiques sur des données et projets réels. Les nouvelles formations sont ajoutées ici dès leur ouverture.'
    },
    home_courses_btn: {
      ar: 'عرض تفاصيل جميع الدورات ↗',
      en: 'View All Courses Details ↗',
      fr: 'Voir toutes les formations ↗'
    },
    home_books_h2: {
      ar: 'مكتبة الكتب والمراجع الرقمية',
      en: 'Digital Books & References Library',
      fr: 'Bibliothèque de Livres & Références Numériques'
    },
    home_books_lede: {
      ar: 'كتب تخصصية ومراجع علمية للتحميل المجاني.',
      en: 'Specialized books and scientific references, free to download.',
      fr: 'Livres spécialisés et références scientifiques, en téléchargement gratuit.'
    },
    home_books_note: {
      ar: 'كل الكتب متاحة للتحميل مجاناً للجميع.',
      en: 'All books are free to download for everyone.',
      fr: 'Tous les livres sont téléchargeables gratuitement par tous.'
    },
    home_books_btn: {
      ar: 'الدخول إلى مكتبة الكتب الكاملة ↗',
      en: 'Access Full Books Library ↗',
      fr: 'Accéder à la bibliothèque complète ↗'
    },
    qgis_section_h2: {
      ar: 'الدورة المتاحة الآن: نظم المعلومات الجغرافية بـ QGIS',
      en: 'Course Available Now: GIS with QGIS & Google Earth',
      fr: 'Formation Disponible: SIG avec QGIS & Google Earth'
    },
    qgis_section_lede: {
      ar: 'دورة تأسيسية تطبيقية مبنية على سبع وحدات متتالية وخمسة تمارين على بيانات حقيقية من الجزائر.',
      en: 'A foundational practical course based on seven sequential modules and five hands-on exercises with real data from Algeria.',
      fr: "Une formation pratique fondamentale basée sur sept modules séquentiels et cinq exercices pratiques sur des données réelles d'Algérie."
    },

    home_qgis_objectives_h2: {
      ar: 'ماذا ستتعلّم',
      en: 'What You Will Learn',
      fr: 'Ce que vous apprendrez'
    },
    home_qgis_objectives_lede: {
      ar: 'سبعة أهداف عامة تغطي دورة حياة مشروع نظم المعلومات الجغرافية: من تثبيت البرنامج وإدارة الإحداثيات، إلى التحليل المكاني وإخراج الخريطة.',
      en: 'Seven core objectives covering the entire GIS lifecycle: from installation and CRS management to spatial analysis and cartographic production.',
      fr: 'Sept objectifs généraux couvrant le cycle de vie complet d’un projet SIG : de l’installation et la gestion des SCR à l’analyse spatiale et l’édition de cartes.'
    },
    home_qgis_objectives_caption: {
      ar: 'في نهاية الدورة ستكون قادراً على هيكلة مشروع نظم معلومات جغرافية، وتحليل البيانات المكانية الأساسية، وإنتاج خرائط واضحة وفعّالة.',
      en: 'By the end of this course, you will be able to structure a GIS project, analyze spatial vector/raster data, and produce high-impact, professional maps.',
      fr: 'À l’issue de la formation, vous saurez structurer un projet SIG complet, analyser les données spatiales et concevoir des cartes professionnelles et rigoureuses.'
    },
    home_qgis_units_h2: {
      ar: 'مسار الدورة',
      en: 'Course Curriculum',
      fr: 'Programme de la Formation'
    },
    home_qgis_units_lede: {
      ar: 'سبع وحدات متتالية، كل منها مبنية على ما قبلها. ابدأ من الوحدة 0 وتقدّم بالترتيب.',
      en: 'Seven sequential modules, each building upon the previous. Start from Module 0 and advance step by step.',
      fr: 'Sept modules séquentiels, chacun s’appuyant sur le précédent. Commencez par le Module 0 et progressez par ordre.'
    },
    unit_badge_pfx: { ar: 'الوحدة ', en: 'Module ', fr: 'Module ' },
    unit_details_btn: { ar: 'تفاصيل الوحدة', en: 'Module Details', fr: 'Détails du module' },

    home_qgis_flow_h2: {
      ar: 'كيف تسير كل وحدة',
      en: 'How Each Module Works',
      fr: 'Déroulement de chaque module'
    },
    home_qgis_flow_lede: {
      ar: 'نفس البنية في كل تمرين، حتى تعرف دائماً أين أنت وما الخطوة التالية.',
      en: 'A consistent structure across every exercise so you always know your progress and next step.',
      fr: 'Une structure rigoureuse pour chaque exercice afin de toujours maîtriser votre progression.'
    },
    flow_step1_h: { ar: 'المفهوم', en: 'Concept', fr: 'Concept' },
    flow_step1_p: {
      ar: 'مقدمة وجزء نظري قصير يشرح الفكرة قبل لمس البرنامج.',
      en: 'A concise theoretical briefing explaining spatial principles before using the software.',
      fr: 'Une introduction théorique concise pour poser les bases avant de manipuler le logiciel.'
    },
    flow_step2_h: { ar: 'الأهداف', en: 'Objectives', fr: 'Objectifs' },
    flow_step2_p: {
      ar: 'قائمة واضحة بما ستقدر على فعله في نهاية التمرين.',
      en: 'Explicit learning outcomes and measurable competencies you achieve in every exercise.',
      fr: 'Objectifs pédagogiques clairs et compétences mesurables validées à chaque étape.'
    },
    flow_step3_h: { ar: 'التطبيق', en: 'Practice', fr: 'Pratique' },
    flow_step3_p: {
      ar: 'خطوات مرقّمة داخل QGIS على بيانات من بجاية والبليدة والوادي.',
      en: 'Numbered practical steps in QGIS working with real datasets from Béjaïa, Blida, and El Oued.',
      fr: 'Étapes détaillées et numérotées sous QGIS sur des jeux de données réels d’Algérie.'
    },
    flow_step4_h: { ar: 'النتيجة', en: 'Result', fr: 'Résultat' },
    flow_step4_p: {
      ar: 'طبقة أو خريطة جاهزة تحفظها وتستعملها في الوحدة التالية.',
      en: 'A validated spatial layer or publication-ready map stored in GeoPackage for the next unit.',
      fr: 'Une couche spatiale validée ou carte finale sauvegardée pour le module suivant.'
    },

    home_qgis_areas_h2: {
      ar: 'مناطق الدراسة',
      en: 'Study Areas',
      fr: 'Zones d’Étude'
    },
    home_qgis_areas_lede: {
      ar: 'التمارين لا تعتمد على أمثلة افتراضية: ستعمل على خرائط وقياسات من الجزائر. اختر منطقة لعرضها على الخريطة.',
      en: 'Hands-on exercises work with real Algerian geospatial data. Select an area to inspect on the map.',
      fr: 'Exercices pratiques sur des données géographiques réelles d’Algérie. Sélectionnez une zone pour l’afficher sur la carte.'
    },
    home_qgis_target_h2: {
      ar: 'لمن هذه الدورة',
      en: 'Who This Course Is For',
      fr: 'À qui s’adresse cette formation'
    },
    home_qgis_target_p: {
      ar: 'للطلاب والمهنيين والباحثين، ولكل من يرغب في اكتساب أسس متينة في نظم المعلومات الجغرافية بأداة مفتوحة المصدر وقوية وواسعة الانتشار. تُستعمل هذه المهارات في الإدارة البيئية، تخطيط الأراضي، تحليل المخاطر، البنية التحتية، النقل والتخطيط العمراني.',
      en: 'For students, professionals, and researchers seeking solid foundations in GIS using powerful open-source software. Applicable in environmental management, spatial planning, hazard assessment, and urban infrastructure.',
      fr: 'Pour étudiants, professionnels et chercheurs désirant acquérir de solides compétences en SIG avec un logiciel open-source performant. Utilisé en gestion environnementale, aménagement du territoire et urbanisme.'
    },
    home_qgis_tools_h2: {
      ar: 'البرامج المستعملة',
      en: 'Software & Tools Used',
      fr: 'Logiciels & Outils Utilisés'
    },
    th_software: { ar: 'البرنامج', en: 'Software', fr: 'Logiciel' },
    th_usage: { ar: 'الاستخدام في الدورة', en: 'Role in Course', fr: 'Rôle dans la formation' },
    th_price: { ar: 'السعر / الترخيص', en: 'License', fr: 'Licence' },

    home_faq_h2: {
      ar: 'أسئلة شائعة',
      en: 'Frequently Asked Questions',
      fr: 'Foire Aux Questions'
    },
    home_cta_h2: {
      ar: 'ابدأ بالوحدة الأولى',
      en: 'Start with Module 1',
      fr: 'Commencez par le Module 1'
    },
    home_cta_p: {
      ar: 'سجّل الآن، ثبّت QGIS، وافتح أول طبقة بيانات في الوحدة 1.',
      en: 'Register now, install QGIS, and open your first geospatial layer in Module 1.',
      fr: 'Inscrivez-vous maintenant, installez QGIS et ouvrez votre première couche de données au Module 1.'
    },
    home_cta_btn: {
      ar: 'سجّل في الدورة',
      en: 'Enroll in Course',
      fr: 'S’inscrire à la formation'
    },

    // Courses Page
    courses_head_title: {
      ar: 'كتالوج الدورات التدريبية',
      en: 'Training Courses Catalog',
      fr: 'Catalogue des Formations'
    },
    courses_head_lede: {
      ar: 'مسارات تدريبية تطبيقية متكاملة مصممة لنقلك من الأساسيات النظرية إلى الاحتراف العملي على بيانات ومشاريع حقيقية.',
      en: 'Comprehensive practical training paths designed to take you from fundamentals to professional mastery with real data and projects.',
      fr: 'Des parcours de formation pratiques complets conçus pour passer des bases théoriques à la maîtrise professionnelle sur des projets réels.'
    },
    courses_filter_all: { ar: 'جميع الدورات', en: 'All Courses', fr: 'Toutes les formations' },
    courses_filter_gis: { ar: 'نظم المعلومات الجغرافية', en: 'GIS', fr: 'SIG' },
    courses_filter_rs: { ar: 'الاستشعار عن بعد', en: 'Remote Sensing', fr: 'Télédétection' },
    courses_filter_hydro: { ar: 'الهيدرولوجيا والمياه', en: 'Hydrology', fr: 'Hydrologie' },
    courses_filter_prog: { ar: 'البرمجة والأتمتة', en: 'Programming & Python', fr: 'Programmation & Python' },
    membership_box_h2: {
      ar: 'عضوية المنصة الموحدة',
      en: 'Unified Platform Membership',
      fr: 'Adhésion Unifiée à la Plateforme'
    },
    membership_box_p: {
      ar: 'التسجيل في المنصة يمنحك حساباً يتيح لك الوصول إلى الدورات المفتوحة، والدليل المفصّل، وملفات التمارين وبيانات المشاريع.',
      en: 'Registering gives you an account with access to the open courses, the detailed guide, and the exercise files and project data.',
      fr: "L'inscription vous donne un compte avec accès aux formations ouvertes, au guide détaillé, ainsi qu'aux fichiers d'exercices et données de projets."
    },
    membership_box_btn: {
      ar: 'انضم للمنصة واشترك الآن',
      en: 'Join Platform & Subscribe Now',
      fr: 'Rejoindre & S’abonner maintenant'
    },

    // Books Page
    books_head_title: {
      ar: 'مكتبة الكتب والمراجع الجغرافية',
      en: 'Geographical Books & References Library',
      fr: 'Bibliothèque de Livres & Références Géographiques'
    },
    books_head_lede: {
      ar: 'مراجع متقدمة وكتب تخصصية في نظم المعلومات الجغرافية، الاستشعار عن بعد، وهندسة المياه، مع روابط تحميل مباشرة.',
      en: 'Advanced references and specialized textbooks in GIS, Remote Sensing, and Water Engineering, with direct download links.',
      fr: "Références avancées et manuels spécialisés en SIG, Télédétection et Ingénierie de l'eau, avec liens de téléchargement direct."
    },
    books_search_placeholder: {
      ar: 'ابحث عن كتاب، مؤلف، أو موضوع…',
      en: 'Search for a book, author, or topic...',
      fr: 'Rechercher un livre, auteur ou sujet...'
    },
    books_filter_all: { ar: 'جميع الكتب', en: 'All Books', fr: 'Tous les livres' },
    request_subscription: {
      ar: 'طلب الاشتراك',
      en: 'Request Membership',
      fr: 'Demande d’adhésion'
    },

    // Lock Modal

    // Card labels & buttons
    card_level: { ar: 'المستوى: ', en: 'Level: ', fr: 'Niveau: ' },
    card_duration: { ar: 'المدة: ', en: 'Duration: ', fr: 'Durée: ' },
    card_highlights: { ar: 'أبرز محاور الدورة:', en: 'Course Highlights:', fr: 'Points Clés de la Formation:' },
    card_software: { ar: 'البرمجيات والبيانات:', en: 'Software & Data:', fr: 'Logiciels & Données:' },
    btn_enter_course: { ar: 'دخول محتوى الدورة', en: 'Enter Course', fr: 'Accéder au cours' },
    btn_register_course: { ar: 'حجز مقعد والتسجيل', en: 'Register Now', fr: 'S’inscrire' },
    btn_view_book_details: { ar: 'عرض الكتاب والتحميل ↗', en: 'View & Download Book ↗', fr: 'Voir & Télécharger ↗' },
    btn_download_drive: {
      ar: 'تحميل 📥',
      en: 'Download 📥',
      fr: 'Télécharger 📥'
    },

    // Registration Page (register.html)
    reg_title: { ar: 'التسجيل في المنصة', en: 'Platform Registration', fr: 'Inscription à la Plateforme' },
    reg_lede: {
      ar: 'املأ النموذج وسنتواصل معك عبر البريد الإلكتروني بتفاصيل الانطلاق والتفعيل.',
      en: 'Fill out the form and we will contact you via email with setup and activation details.',
      fr: 'Remplissez le formulaire et nous vous contacterons par e-mail avec les détails d’activation.'
    },
    reg_course_label: { ar: 'الدورة أو المسار التدريبي المطلوب', en: 'Selected Course or Training Path', fr: 'Formation ou Parcours Souhaité' },
    reg_name_label: { ar: 'الاسم الكامل', en: 'Full Name', fr: 'Nom et Prénom' },
    reg_email_label: { ar: 'البريد الإلكتروني', en: 'Email Address', fr: 'Adresse E-mail' },
    reg_phone_label: { ar: 'رقم الهاتف (اختياري)', en: 'Phone Number (Optional)', fr: 'Téléphone (Facultatif)' },
    reg_city_label: { ar: 'الولاية / المدينة', en: 'City / Province', fr: 'Ville / Wilaya' },
    reg_profile_label: { ar: 'الصفة المهنية', en: 'Professional Profile', fr: 'Statut' },
    reg_profile_student: { ar: 'طالب', en: 'Student', fr: 'Étudiant' },
    reg_profile_pro: { ar: 'مهني', en: 'Professional', fr: 'Professionnel' },
    reg_profile_researcher: { ar: 'باحث', en: 'Researcher', fr: 'Chercheur' },
    reg_profile_other: { ar: 'أخرى', en: 'Other', fr: 'Autre' },
    reg_level_label: { ar: 'مستواك في نظم المعلومات الجغرافية', en: 'Your GIS Experience Level', fr: 'Votre Niveau en SIG' },
    reg_level_opt0: { ar: 'اختر مستواك', en: 'Select your level', fr: 'Sélectionnez votre niveau' },
    reg_level_opt1: { ar: 'لم أستعمل أي برنامج SIG من قبل', en: 'Never used GIS software before', fr: 'Jamais utilisé de SIG auparavant' },
    reg_level_opt2: { ar: 'جرّبت QGIS أو ArcGIS قليلاً', en: 'Some experience with QGIS or ArcGIS', fr: 'Quelques notions sous QGIS ou ArcGIS' },
    reg_level_opt3: { ar: 'أستعمل برنامج SIG في عملي أو دراستي', en: 'Regular GIS user in work or research', fr: 'Utilisateur régulier en travail ou étude' },
    reg_msg_label: { ar: 'ما الذي تريد تحقيقه من الدورة؟ (اختياري)', en: 'What are your goals for this course? (Optional)', fr: 'Quels sont vos objectifs pour ce cours ? (Facultatif)' },
    reg_submit_btn: { ar: 'إرسال طلب التسجيل', en: 'Submit Registration Application', fr: 'Envoyer ma demande d’inscription' },
    reg_aside_h2: { ar: 'ما الذي تمنحه لك العضوية', en: 'What Your Membership Includes', fr: 'Ce que comprend votre adhésion' },
    reg_aside_f1: { ar: 'حساب موحد للدخول إلى جميع الدورات التدريبية المفتوحة.', en: 'Unified account access to all active training courses.', fr: 'Compte d’accès unifié à toutes les formations ouvertes.' },
    reg_aside_f2: {
      ar: 'الدليل المفصّل (PDF) وطرق التنفيذ خطوة بخطوة داخل QGIS.',
      en: 'The detailed guide (PDF) and step-by-step instructions in QGIS.',
      fr: 'Le guide détaillé (PDF) et les explications pas à pas dans QGIS.'
    },
    reg_aside_f3: { ar: 'بيانات التمارين، النماذج، وملفات المشاريع الحقيقية.', en: 'Real-world project datasets, elevation models, and project templates.', fr: 'Données d’exercices, MNT et fichiers projets réels complets.' },
    reg_aside_f4: { ar: 'مرافقة المدرّب أثناء الحصص ومعجم مصطلحات عربي / فرنسي / إنجليزي.', en: 'Guidance from the trainer during sessions and an Arabic / French / English glossary.', fr: 'Accompagnement du formateur pendant les séances et glossaire arabe / français / anglais.' },
    reg_course_opt_all: {
      ar: 'عضوية المنصة (كل الدورات المفتوحة)',
      en: 'Platform membership (all open courses)',
      fr: 'Adhésion à la plateforme (toutes les formations ouvertes)'
    },
    reg_requirements_h2: { ar: 'المتطلبات التقنية', en: 'Technical Requirements', fr: 'Prérequis Techniques' },
    reg_req_pc: { ar: 'حاسوب يعمل بنظام Windows أو macOS أو Linux.', en: 'Computer running Windows, macOS, or Linux.', fr: 'Ordinateur sous Windows, macOS ou Linux.' },
    reg_req_net: { ar: 'اتصال بالإنترنت لتحميل البرامج والبيانات والمراجع.', en: 'Internet connection to download software, datasets, and references.', fr: 'Connexion Internet pour télécharger logiciels, données et livres.' },
    reg_req_bg: { ar: 'لا تُشترط أي خلفية أو خبرة سابقة في نظم المعلومات الجغرافية.', en: 'No prior GIS background or experience required.', fr: 'Aucune expérience préalable en SIG requise.' },
    reg_msg_sent_title: { ar: 'تم إرسال طلب التسجيل بنجاح', en: 'Application Submitted Successfully', fr: 'Demande d’inscription envoyée avec succès' },
    reg_msg_sent_desc: { ar: 'شكراً لك. ستصلك رسالة عبر بريدك الإلكتروني بكافة تفاصيل الانطلاق والحساب.', en: 'Thank you. You will receive an email shortly with platform access and setup details.', fr: 'Merci. Vous recevrez un e-mail avec les détails d’accès et d’activation.' },

    // Program Page (program.html)
    prog_title: { ar: 'برنامج الدورة', en: 'Course Curriculum', fr: 'Programme de la Formation' },
    prog_lede: { ar: 'الهيكل العام للمقرر: سبع وحدات، لكل وحدة محور وتمرين تطبيقي.', en: 'Course curriculum structure: seven modules, each with core theory and hands-on exercises.', fr: 'Structure pédagogique : sept modules, chacun combinant théorie et exercice pratique.' },
    prog_th_unit: { ar: 'الوحدة', en: 'Module', fr: 'Module' },
    prog_th_axis: { ar: 'المحور', en: 'Subject Axis', fr: 'Axe Pédagogique' },
    prog_th_exercise: { ar: 'التمرين التطبيقي', en: 'Hands-on Exercise', fr: 'Exercice Pratique' },
    prog_open_unit: { ar: 'فتح الوحدة', en: 'Open Module', fr: 'Ouvrir le module' },
    prog_btn_start0: { ar: 'ابدأ من الوحدة 0', en: 'Start from Module 0', fr: 'Commencer au Module 0' },
    prog_btn_guide: { ar: 'الدليل المفصّل (PDF) — للمتدرّبين', en: 'Detailed Guidebook (PDF) — Members', fr: 'Manuel Complet (PDF) — Membres' },
    prog_btn_download_plan: { ar: 'تحميل ملخص الخطة (صورة)', en: 'Curriculum Summary (Image)', fr: 'Résumé du Plan (Image)' },
    prog_cta_h2: { ar: 'جاهز للوحدة الأولى؟', en: 'Ready for Module 1?', fr: 'Prêt pour le Module 1 ?' },
    prog_cta_p: { ar: 'سجّل في الدورة، ثم ثبّت QGIS من صفحة الموارد.', en: 'Enroll in the course, then install QGIS from the resources page.', fr: 'Inscrivez-vous au cours, puis installez QGIS depuis la page ressources.' },

    // Resources Page (resources.html)
    res_head_title: { ar: 'البرامج والمصطلحات', en: 'Software & Terminology', fr: 'Logiciels & Terminologie' },
    res_head_lede: { ar: 'كل ما تحتاجه قبل البدء: روابط تحميل البرامج، معجم المصطلحات بثلاث لغات، وملحقات عملية.', en: 'Everything you need before starting: download links, trilingual GIS glossary, and practical references.', fr: 'Tout le nécessaire avant de commencer : téléchargements, glossaire SIG trilingue et annexes pratiques.' },
    res_before_u1_h2: { ar: 'قبل الوحدة الأولى', en: 'Before Module 1', fr: 'Avant le Module 1' },
    res_before_u1_lede: { ar: 'ثبّت هذه البرامج. كلها مجانية ومفتوحة المصدر.', en: 'Install these software tools. All are free and open source.', fr: 'Installez ces logiciels. Tous sont gratuits et open source.' },
    res_guide_h2: { ar: 'الدليل المفصّل للدورة', en: 'Detailed Course Guidebook', fr: 'Manuel Détaillé du Cours' },
    res_guide_p: { ar: 'ملف PDF يتبع منهاج الموقع وحدةً بوحدة وخطوةً بخطوة، مع خطوات التطبيق في QGIS ومرفقات Google Earth Pro.', en: 'A comprehensive PDF handbook following the platform curriculum module by module with practical steps in QGIS.', fr: 'Un manuel PDF complet suivant le programme module par module avec les étapes détaillées sous QGIS.' },
    res_btn_download_pdf: { ar: 'تحميل الدليل (PDF)', en: 'Download Guide (PDF)', fr: 'Télécharger le Guide (PDF)' },
    res_guide_note: { ar: 'التحميل متاح للمشتركين والطلاب المسجَّلين عبر حساب المنصة.', en: 'Downloads are reserved for registered members via platform accounts.', fr: 'Téléchargement réservé aux membres inscrits via leur compte.' },
    res_in_units_h2: { ar: 'في صفحات الوحدات', en: 'Inside Module Pages', fr: 'Dans les Pages des Modules' },
    res_in_units_p: { ar: 'بعد الدخول بحسابك، افتح أي وحدة واضغط «طريقة التنفيذ» لاستعراض الشروحات وخطوات التمارين.', en: 'Once signed in, open any module and click “How to do it” to see the explanations and exercise steps.', fr: 'Une fois connecté, ouvrez un module et cliquez sur « Méthode » pour voir les explications et les étapes.' },
    res_glossary_h2: { ar: 'معجم المصطلحات الجغرافية', en: 'GIS Terminology Glossary', fr: 'Glossaire Terminologique SIG' },
    res_glossary_lede: { ar: 'واجهة QGIS تدعم عدة لغات. استعمل هذا المعجم للربط الدقيق بين المصطلحات بالعربية والإنجليزية والفرنسية.', en: 'QGIS supports multiple languages. Use this glossary to cross-reference terms in Arabic, French, and English.', fr: 'QGIS supporte plusieurs langues. Utilisez ce glossaire pour faire la correspondance en arabe, français et anglais.' },
    res_glossary_search: { ar: 'ابحث: إسقاط، Raster، Couche…', en: 'Search: Projection, Raster, Layer...', fr: 'Recherche : Projection, Raster, Couche...' },
    res_appendix_h2: { ar: 'ملحقات عملية', en: 'Practical Annexes', fr: 'Annexes Pratiques' },
    res_appendix_lede: { ar: 'مقارنات تقنية، قوائم البرامج، اختصارات لوحة المفاتيح، والحلول السريعة للأخطاء الشائعة.', en: 'Tool comparisons, menu references in English and French, keyboard shortcuts, and troubleshooting.', fr: 'Comparatifs d’outils, menus en anglais et français, raccourcis clavier et dépannage.' },
    res_further_h2: { ar: 'مصادر ومراجع للتعمّق', en: 'Official Resources & External References', fr: 'Ressources Officielles & Références' },

    // Lesson Page (lesson.html)
    lesson_crumb_unit: { ar: 'الوحدة ', en: 'Module ', fr: 'Module ' },
    lesson_objectives_h2: { ar: 'أهداف التعلّم', en: 'Learning Objectives', fr: 'Objectifs d’Apprentissage' },
    lesson_steps_h2: { ar: 'محتوى التمرين', en: 'Exercise Steps & Workflow', fr: 'Déroulement de l’Exercice' },
    lesson_toggle_all: { ar: 'اعرض كل التفاصيل', en: 'Expand All Details', fr: 'Tout Développer' },
    lesson_toggle_all_hide: { ar: 'أخفِ كل التفاصيل', en: 'Collapse All Details', fr: 'Tout Réduire' },
    lesson_locked_title: { ar: 'طريقة التنفيذ والشروحات للمتدرّبين المسجَّلين', en: 'Implementation Details for Registered Members', fr: 'Méthode d’Exécution Réservée aux Membres' },
    lesson_locked_desc: { ar: 'يظهر هنا لكل بند خطوات تنفيذه داخل QGIS ومرفقات Google Earth Pro بعد تسجيل الدخول.', en: 'Step-by-step QGIS guidance and Google Earth integration appear here after logging in.', fr: 'Le guidage pas à pas sous QGIS et Google Earth s’affiche ici après connexion.' },
    lesson_result_h2: { ar: 'مخرجات ونتيجة التمرين', en: 'Deliverable Output', fr: 'Résultat Livrable' },
    lesson_materials_h2: { ar: 'مواد وبيانات الوحدة', en: 'Module Data & Materials', fr: 'Données & Fichiers du Module' },
    lesson_prev_unit: { ar: 'الوحدة السابقة', en: 'Previous Module', fr: 'Module Précédent' },
    lesson_next_unit: { ar: 'الوحدة التالية', en: 'Next Module', fr: 'Module Suivant' },
    lesson_back_program: { ar: 'العودة إلى البرنامج', en: 'Back to Curriculum', fr: 'Retour au Programme' },

    // Files Page (files.html)
    files_head_title: { ar: 'ملفات الدورة وحسابي', en: 'Course Files & Member Account', fr: 'Fichiers du Cours & Compte' },
    files_head_lede: {
      ar: 'الدليل المفصّل ومواد التمارين متاحة للمتدرّبين المسجَّلين فقط. ادخل بالحساب الذي أرسله لك المدرّب.',
      en: 'The detailed guide and exercise materials are for registered trainees only. Sign in with the account the trainer sent you.',
      fr: "Le guide détaillé et les supports d'exercices sont réservés aux stagiaires inscrits. Connectez-vous avec le compte envoyé par le formateur."
    },
    files_login_h2: { ar: 'تسجيل الدخول', en: 'Sign In', fr: 'Connexion' },
    files_login_email: { ar: 'البريد الإلكتروني', en: 'Email Address', fr: 'Adresse E-mail' },
    files_login_pw: { ar: 'كلمة المرور', en: 'Password', fr: 'Mot de passe' },
    files_login_btn: { ar: 'دخول', en: 'Sign In', fr: 'Se connecter' },
    files_guide_h2: { ar: 'الدليل المفصّل (PDF)', en: 'Detailed Guidebook (PDF)', fr: 'Manuel Complet (PDF)' },
    files_materials_h2: { ar: 'مواد وبيانات التمارين', en: 'Hands-on Datasets & Files', fr: 'Jeux de Données & Fichiers' },

    // ---------- إضافات: عامة ----------
    lang_group: { ar: 'اللغة', en: 'Language', fr: 'Langue' },
    close: { ar: 'إغلاق', en: 'Close', fr: 'Fermer' },
    admin_title: { ar: 'لوحة الإدارة', en: 'Admin panel', fr: 'Administration' },
    footer_glossary: { ar: 'معجم المصطلحات ثلاثي اللغات', en: 'Trilingual glossary', fr: 'Glossaire trilingue' },
    guide_ar_note: {
      ar: 'الشروحات التفصيلية مكتوبة بالعربية.',
      en: 'The detailed instructions below are written in Arabic.',
      fr: 'Les explications détaillées ci-dessous sont rédigées en arabe.'
    },

    // ---------- الصفحة الرئيسية ----------
    sheet_title: { ar: 'بجاية — ورقة توضيحية', en: 'Béjaïa — illustrative sheet', fr: 'Béjaïa — feuille illustrative' },
    sheet_note: {
      ar: 'تمثيل توضيحي لأغراض التدريب — ليس خريطة رسمية',
      en: 'Illustration for training purposes — not an official map',
      fr: 'Illustration à but pédagogique — pas une carte officielle'
    },
    sheet_svg_title: {
      ar: 'ورقة طوبوغرافية توضيحية لساحل بجاية مع طبقات قابلة للإظهار والإخفاء',
      en: 'Illustrative topographic sheet of the Béjaïa coast with layers you can show or hide',
      fr: 'Feuille topographique illustrative de la côte de Béjaïa, avec des couches à afficher ou masquer'
    },
    layer_replay_title: { ar: 'إعادة عرض الإرجاع الجغرافي', en: 'Replay the georeferencing', fr: 'Rejouer le géoréférencement' },
    areas_map_label: { ar: 'خريطة مناطق الدراسة', en: 'Map of the study areas', fr: 'Carte des zones d’étude' },
    map_offline: {
      ar: 'الخريطة التفاعلية تحتاج اتصالاً بالإنترنت لتحميل خلفية OpenStreetMap.',
      en: 'The interactive map needs an internet connection to load the OpenStreetMap background.',
      fr: 'La carte interactive nécessite une connexion Internet pour charger le fond OpenStreetMap.'
    },

    // ---------- الدورات والكتب ----------
    courses_empty: { ar: 'لا توجد دورات في هذا التصنيف حالياً.', en: 'No courses in this category yet.', fr: 'Aucune formation dans cette catégorie pour le moment.' },
    books_search_label: { ar: 'ابحث في المكتبة', en: 'Search the library', fr: 'Rechercher dans la bibliothèque' },
    books_loading: { ar: 'جارٍ تحميل مكتبة الكتب…', en: 'Loading the library…', fr: 'Chargement de la bibliothèque…' },
    books_error: {
      ar: 'تعذّر تحميل المكتبة الآن. تحقّق من اتصالك ثم أعد تحميل الصفحة.',
      en: 'The library could not be loaded right now. Check your connection and reload the page.',
      fr: 'Impossible de charger la bibliothèque pour le moment. Vérifiez votre connexion et rechargez la page.'
    },
    books_none: { ar: 'لم تُنشر كتب في المكتبة بعد.', en: 'No books have been published yet.', fr: 'Aucun livre n’a encore été publié.' },
    books_no_match: { ar: 'لا توجد كتب مطابقة لبحثك في هذا القسم.', en: 'No books match your search in this section.', fr: 'Aucun livre ne correspond à votre recherche dans cette rubrique.' },
    res_links_h2: { ar: 'روابط مفيدة', en: 'Useful links', fr: 'Liens utiles' },
    res_links_lede: {
      ar: 'مواقع ومصادر مختارة تكمّل الدورة: بيانات وخرائط، دروس، وأدوات على الإنترنت.',
      en: 'Hand-picked websites that complement the course: data and maps, tutorials, and online tools.',
      fr: 'Sites sélectionnés pour compléter la formation : données et cartes, tutoriels et outils en ligne.'
    },
    res_links_empty: { ar: 'لا توجد روابط بعد. أضف أول رابط من لوحة الإدارة.', en: 'No links yet.', fr: 'Aucun lien pour le moment.' },
    admin_add_link: { ar: '+ إضافة رابط جديد', en: '+ Add a link', fr: '+ Ajouter un lien' },
    link_cat_software: { ar: 'برامج وإضافات', en: 'Software & plugins', fr: 'Logiciels & extensions' },
    link_cat_data: { ar: 'بيانات وخرائط', en: 'Data & maps', fr: 'Données & cartes' },
    link_cat_learning: { ar: 'دروس ومراجع للتعلّم', en: 'Tutorials & learning', fr: 'Tutoriels & apprentissage' },
    link_cat_tools: { ar: 'أدوات على الإنترنت', en: 'Online tools', fr: 'Outils en ligne' },
    link_cat_other: { ar: 'روابط أخرى', en: 'Other links', fr: 'Autres liens' },
    link_open_new: { ar: '(يفتح في نافذة جديدة)', en: '(opens in a new tab)', fr: '(s’ouvre dans un nouvel onglet)' },
    share_btn: { ar: 'مشاركة', en: 'Share', fr: 'Partager' },
    share_head: { ar: 'شارك عبر', en: 'Share via', fr: 'Partager via' },
    share_email: { ar: 'البريد الإلكتروني', en: 'Email', fr: 'E-mail' },
    share_copy: { ar: 'نسخ الرابط', en: 'Copy link', fr: 'Copier le lien' },
    share_copied: { ar: 'تم نسخ الرابط ✓', en: 'Link copied ✓', fr: 'Lien copié ✓' },
    share_book_text: { ar: 'كتاب للتحميل المجاني: {t}', en: 'Free book to download: {t}', fr: 'Livre à télécharger gratuitement : {t}' },
    share_course_text: { ar: 'دورة تدريبية: {t}', en: 'Training course: {t}', fr: 'Formation : {t}' },
    share_program_text: { ar: 'دورة QGIS و Google Earth التطبيقية على بيانات حقيقية من الجزائر', en: 'Hands-on QGIS & Google Earth course on real data from Algeria', fr: 'Formation pratique QGIS & Google Earth sur des données réelles d’Algérie' },
    book_link_missing: { ar: 'الرابط غير متاح حالياً', en: 'Link not available', fr: 'Lien indisponible' },

    // ---------- الوحدات ----------
    lesson_units_nav: { ar: 'الوحدات', en: 'Modules', fr: 'Modules' },
    lesson_area: { ar: 'منطقة الدراسة:', en: 'Study area:', fr: 'Zone d’étude :' },
    lesson_how: { ar: 'طريقة التنفيذ', en: 'How to do it', fr: 'Méthode' },
    lesson_read: { ar: 'اقرأ الشرح', en: 'Read the explanation', fr: 'Lire l’explication' },
    lesson_loading: { ar: 'جارٍ تحميل الشروحات…', en: 'Loading the instructions…', fr: 'Chargement des explications…' },
    lesson_steps_hint: {
      ar: 'اضغط «طريقة التنفيذ» تحت أي بند لعرض خطواته داخل QGIS، كما في الدليل المفصّل (PDF).',
      en: 'Click “How to do it” under any item to see its steps in QGIS, as in the detailed guide (PDF).',
      fr: 'Cliquez sur « Méthode » sous un point pour voir ses étapes dans QGIS, comme dans le guide détaillé (PDF).'
    },
    lesson_extras_h2: { ar: 'لإتمام أهداف التعلّم', en: 'To complete the learning objectives', fr: 'Pour compléter les objectifs' },
    lesson_ge_optional: { ar: 'تطبيق اختياري في', en: 'Optional exercise in', fr: 'Application facultative dans' },
    lesson_ge_opt_badge: { ar: 'تطبيق اختياري', en: 'Optional', fr: 'Facultatif' },
    lesson_ge_in: { ar: 'في', en: 'In', fr: 'Dans' },
    lesson_not_uploaded: { ar: 'لم يُرفع محتوى هذه الوحدة بعد.', en: 'The content of this module has not been uploaded yet.', fr: 'Le contenu de ce module n’a pas encore été mis en ligne.' },
    lesson_last_unit: { ar: 'هذه آخر وحدة', en: 'This is the last module', fr: 'C’est le dernier module' },
    lesson_pager: { ar: 'التنقل بين الوحدات', en: 'Module navigation', fr: 'Navigation entre modules' },
    mat_pdf: { ar: 'كتاب التمرين', en: 'Exercise booklet', fr: 'Cahier d’exercice' },
    mat_zip: { ar: 'مجلد البيانات', en: 'Data folder', fr: 'Dossier de données' },

    // ---------- الموارد ----------
    res_open_u1: { ar: 'افتح الوحدة 1', en: 'Open Module 1', fr: 'Ouvrir le module 1' },
    res_glossary_label: { ar: 'ابحث في المعجم', en: 'Search the glossary', fr: 'Rechercher dans le glossaire' },
    res_glossary_empty: { ar: 'لا يوجد مصطلح مطابق. جرّب كلمة أقصر أو لغة أخرى.', en: 'No matching term. Try a shorter word or another language.', fr: 'Aucun terme correspondant. Essayez un mot plus court ou une autre langue.' },
    gl_ar: { ar: 'العربية', en: 'Arabic', fr: 'Arabe' },
    gl_fr: { ar: 'الفرنسية', en: 'French', fr: 'Français' },
    gl_en: { ar: 'الإنجليزية', en: 'English', fr: 'Anglais' },
    res_ap_locked_h: { ar: 'الملحقات للمتدرّبين المسجَّلين', en: 'Annexes are for registered trainees', fr: 'Annexes réservées aux stagiaires inscrits' },
    res_ap_locked_p: { ar: 'ادخل بالحساب الذي يرسله المدرّب لعرض الملحقات العملية.', en: 'Sign in with the account the trainer sends you to see the practical annexes.', fr: 'Connectez-vous avec le compte envoyé par le formateur pour voir les annexes pratiques.' },
    ap_compare_h: { ar: 'QGIS و Google Earth Pro: أي برنامج لأي مهمة', en: 'QGIS and Google Earth Pro: which tool for which task', fr: 'QGIS et Google Earth Pro : quel outil pour quelle tâche' },
    ap_menus_h: { ar: 'قوائم QGIS بالإنجليزية والفرنسية', en: 'QGIS menus in English and French', fr: 'Menus de QGIS en anglais et en français' },
    ap_shortcuts_h: { ar: 'اختصارات لوحة المفاتيح', en: 'Keyboard shortcuts', fr: 'Raccourcis clavier' },
    ap_troubles_h: { ar: 'الأخطاء الشائعة وحلولها', en: 'Common errors and fixes', fr: 'Erreurs courantes et solutions' },
    link_qgis_docs: { ar: 'التوثيق الرسمي لـ QGIS', en: 'Official QGIS documentation', fr: 'Documentation officielle de QGIS' },
    link_training: { ar: 'دليل التدريب الرسمي (QGIS Training Manual)', en: 'QGIS Training Manual', fr: 'Manuel de formation QGIS (Training Manual)' },
    link_plugins: { ar: 'مستودع إضافات QGIS', en: 'QGIS plugin repository', fr: 'Dépôt des extensions QGIS' },
    link_earthdata: { ar: 'حساب NASA Earthdata (لتنزيل SRTM)', en: 'NASA Earthdata account (to download SRTM)', fr: 'Compte NASA Earthdata (pour télécharger SRTM)' },
    link_quickosm: { ar: 'إضافة QuickOSM', en: 'QuickOSM plugin', fr: 'Extension QuickOSM' },
    link_epsg: { ar: 'البحث عن رموز EPSG', en: 'Look up EPSG codes', fr: 'Rechercher des codes EPSG' },
    link_colorbrewer: { ar: 'لوحات ألوان ColorBrewer', en: 'ColorBrewer colour palettes', fr: 'Palettes de couleurs ColorBrewer' },
    res_plan_h2: { ar: 'ملخص الخطة', en: 'Course plan summary', fr: 'Résumé du plan' },
    res_plan_p: {
      ar: 'صورة واحدة تلخّص الوحدات والتمارين والأهداف، للطباعة أو المشاركة (بالعربية).',
      en: 'A single image summarising the modules, exercises and objectives, to print or share (in Arabic).',
      fr: 'Une image qui résume modules, exercices et objectifs, à imprimer ou partager (en arabe).'
    },
    res_plan_btn: { ar: 'تحميل الصورة', en: 'Download the image', fr: 'Télécharger l’image' },

    // ---------- التسجيل ----------
    reg_crumb: { ar: 'التسجيل', en: 'Registration', fr: 'Inscription' },
    reg_err_name: { ar: 'اكتب اسمك الكامل.', en: 'Enter your full name.', fr: 'Indiquez votre nom complet.' },
    reg_err_email: { ar: 'اكتب بريداً إلكترونياً صحيحاً، مثل name@gmail.com.', en: 'Enter a valid email address, e.g. name@gmail.com.', fr: 'Saisissez une adresse e-mail valide, par ex. name@gmail.com.' },
    reg_err_city: { ar: 'اكتب ولايتك أو مدينتك.', en: 'Enter your province or city.', fr: 'Indiquez votre wilaya ou votre ville.' },
    reg_err_profile: { ar: 'اختر صفتك.', en: 'Choose your profile.', fr: 'Choisissez votre statut.' },
    reg_err_level: { ar: 'اختر مستواك.', en: 'Choose your level.', fr: 'Choisissez votre niveau.' },
    reg_sending: { ar: 'جارٍ الإرسال…', en: 'Sending…', fr: 'Envoi…' },
    reg_send_failed: {
      ar: 'لم يُرسَل الطلب. تحقّق من اتصالك بالإنترنت ثم أعد المحاولة، أو راسلنا على',
      en: 'Your request was not sent. Check your internet connection and try again, or write to us at',
      fr: 'La demande n’a pas été envoyée. Vérifiez votre connexion et réessayez, ou écrivez-nous à'
    },
    reg_honeypot: { ar: 'اترك هذا الحقل فارغاً', en: 'Leave this field empty', fr: 'Laissez ce champ vide' },
    reg_local_mode: { ar: 'وضع محلي: الطلبات محفوظة في هذا المتصفح', en: 'Local mode: requests are stored in this browser', fr: 'Mode local : les demandes sont enregistrées dans ce navigateur' },
    reg_local_csv: { ar: 'تنزيل الطلبات CSV', en: 'Download requests (CSV)', fr: 'Télécharger les demandes (CSV)' },

    // ---------- ملفاتي وحسابي ----------
    files_off_h: { ar: 'ملفات الدورة غير متاحة بعد', en: 'Course files are not available yet', fr: 'Les fichiers du cours ne sont pas encore disponibles' },
    files_off_p: {
      ar: 'لم يُفعَّل نظام الحسابات على الموقع حتى الآن. للحصول على الدليل تواصل مع المدرّب.',
      en: 'Accounts have not been enabled on the site yet. Contact the trainer to get the guide.',
      fr: 'Les comptes ne sont pas encore activés sur le site. Contactez le formateur pour obtenir le guide.'
    },
    files_no_account: {
      ar: 'ليس لديك حساب؟ الحسابات يُنشئها المدرّب بعد قبول طلب التسجيل.',
      en: 'No account yet? The trainer creates accounts once a registration is accepted.',
      fr: 'Pas encore de compte ? Le formateur crée les comptes une fois l’inscription acceptée.'
    },
    files_register_link: { ar: 'طلب التسجيل', en: 'Registration request', fr: 'Demande d’inscription' },
    files_forgot: { ar: 'نسيت كلمة المرور؟ راسل المدرّب', en: 'Forgot your password? Email the trainer', fr: 'Mot de passe oublié ? Écrivez au formateur' },
    files_forgot_subject: { ar: 'نسيت كلمة المرور — Delta Conception', en: 'Forgotten password — Delta Conception', fr: 'Mot de passe oublié — Delta Conception' },
    files_hello: { ar: 'مرحباً', en: 'Hello', fr: 'Bonjour' },
    files_admin_btn: { ar: 'لوحة الإدارة', en: 'Admin panel', fr: 'Administration' },
    files_change_pw: { ar: 'تغيير كلمة المرور', en: 'Change password', fr: 'Changer le mot de passe' },
    files_logout: { ar: 'خروج', en: 'Sign out', fr: 'Déconnexion' },
    files_new_pw: { ar: 'كلمة المرور الجديدة', en: 'New password', fr: 'Nouveau mot de passe' },
    files_pw_hint: { ar: '(8 أحرف على الأقل)', en: '(at least 8 characters)', fr: '(8 caractères minimum)' },
    files_pw_again: { ar: 'أعد كتابتها', en: 'Type it again', fr: 'Confirmez-le' },
    files_pw_save: { ar: 'حفظ كلمة المرور', en: 'Save password', fr: 'Enregistrer le mot de passe' },
    files_inactive_h: { ar: 'حسابك موقوف حالياً', en: 'Your account is currently suspended', fr: 'Votre compte est actuellement suspendu' },
    files_inactive_p: {
      ar: 'لا يمكنك تحميل الملفات الآن. تواصل مع المدرّب لإعادة تفعيل الحساب.',
      en: 'You cannot download files for now. Contact the trainer to reactivate your account.',
      fr: 'Vous ne pouvez pas télécharger de fichiers pour le moment. Contactez le formateur pour réactiver le compte.'
    },
    files_materials_lede: { ar: 'البيانات والخرائط والملفات التي نعمل عليها في الحصص.', en: 'The data, maps and files we work on in class.', fr: 'Les données, cartes et fichiers utilisés pendant les séances.' },
    files_empty_guide: { ar: 'لا يوجد ملف في هذا القسم بعد.', en: 'No file in this section yet.', fr: 'Aucun fichier dans cette rubrique pour l’instant.' },
    files_empty_materials: { ar: 'لا توجد مواد بعد. ستُضاف قبل الحصص.', en: 'No materials yet. They will be added before the sessions.', fr: 'Pas encore de supports. Ils seront ajoutés avant les séances.' },
    files_books_lede: {
      ar: 'كتب ومراجع رقمية متاحة للتحميل مجاناً في صفحة المكتبة.',
      en: 'Digital books and references, free to download on the library page.',
      fr: 'Livres et références numériques, en téléchargement gratuit sur la page Bibliothèque.'
    },
    files_download: { ar: 'تحميل', en: 'Download', fr: 'Télécharger' },
    files_preparing: { ar: 'جارٍ التحضير…', en: 'Preparing…', fr: 'Préparation…' },
    files_need_both: { ar: 'اكتب البريد الإلكتروني وكلمة المرور.', en: 'Enter your email and password.', fr: 'Saisissez votre e-mail et votre mot de passe.' },
    files_signing_in: { ar: 'جارٍ الدخول…', en: 'Signing in…', fr: 'Connexion…' },
    files_pw_short: { ar: 'كلمة المرور قصيرة: 8 أحرف على الأقل.', en: 'Password too short: at least 8 characters.', fr: 'Mot de passe trop court : 8 caractères minimum.' },
    files_pw_mismatch: { ar: 'الكلمتان غير متطابقتين.', en: 'The two passwords do not match.', fr: 'Les deux mots de passe ne correspondent pas.' },
    files_pw_saved: { ar: 'تم حفظ كلمة المرور الجديدة.', en: 'Your new password has been saved.', fr: 'Le nouveau mot de passe a été enregistré.' },

    // ---------- رسائل الخادم ----------
    err_login: { ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', en: 'Incorrect email or password.', fr: 'E-mail ou mot de passe incorrect.' },
    err_banned: { ar: 'هذا الحساب موقوف. تواصل مع المدرّب.', en: 'This account is suspended. Contact the trainer.', fr: 'Ce compte est suspendu. Contactez le formateur.' },
    err_unconfirmed: { ar: 'الحساب غير مفعَّل بعد. تواصل مع المدرّب.', en: 'This account is not activated yet. Contact the trainer.', fr: 'Ce compte n’est pas encore activé. Contactez le formateur.' },
    err_weak: { ar: 'كلمة المرور ضعيفة: استعمل 8 أحرف على الأقل.', en: 'Weak password: use at least 8 characters.', fr: 'Mot de passe trop faible : 8 caractères minimum.' },
    err_exists: { ar: 'هذا البريد مسجَّل من قبل.', en: 'This email is already registered.', fr: 'Cet e-mail est déjà enregistré.' },
    err_network: {
      ar: 'تعذّر الاتصال بالخادم. تحقّق من اتصالك بالإنترنت ثم أعد المحاولة.',
      en: 'Could not reach the server. Check your internet connection and try again.',
      fr: 'Impossible de joindre le serveur. Vérifiez votre connexion Internet et réessayez.'
    },
    err_unexpected: { ar: 'خطأ غير متوقَّع', en: 'Unexpected error', fr: 'Erreur inattendue' },
    err_session: { ar: 'انتهت الجلسة. سجّل الدخول من جديد.', en: 'Your session has expired. Please sign in again.', fr: 'Votre session a expiré. Reconnectez-vous.' },
    err_books_table: {
      ar: 'جدول الكتب غير موجود في Supabase بعد: شغّل الملف _setup/supabase/books.sql مرة واحدة في SQL Editor.',
      en: 'The books table does not exist in Supabase yet: run _setup/supabase/books.sql once in the SQL Editor.',
      fr: 'La table des livres n’existe pas encore dans Supabase : exécutez une fois _setup/supabase/books.sql dans le SQL Editor.'
    },

    admin_add_course: { ar: '+ إضافة دورة جديدة', en: '+ Add a new course', fr: '+ Ajouter une formation' },
    admin_add_book: { ar: '+ إضافة كتاب إلى المكتبة', en: '+ Add a book to the library', fr: '+ Ajouter un livre' },
    courses_more_soon: {
      ar: 'دورات جديدة ستُعلن هنا قريباً. سجّل اهتمامك وسنراسلك عند افتتاحها.',
      en: 'New courses will be announced here. Register your interest and we will email you when they open.',
      fr: 'De nouvelles formations seront annoncées ici. Inscrivez-vous et nous vous écrirons à leur ouverture.'
    },
    btn_course_details: { ar: 'التفاصيل', en: 'Details', fr: 'Détails' },
    btn_notify_me: { ar: 'سجّل اهتمامك', en: 'Register interest', fr: 'Je suis intéressé(e)' },
    card_field: { ar: 'المجال:', en: 'Field:', fr: 'Domaine :' },
    footer_all_courses: { ar: 'كل الدورات', en: 'All courses', fr: 'Toutes les formations' },
    err_courses_table: {
      ar: 'جدول الدورات غير موجود في Supabase بعد: شغّل الملف _setup/supabase/courses.sql مرة واحدة في SQL Editor.',
      en: 'The courses table does not exist in Supabase yet: run _setup/supabase/courses.sql once in the SQL Editor.',
      fr: 'La table des formations n’existe pas encore dans Supabase : exécutez une fois _setup/supabase/courses.sql dans le SQL Editor.'
    },
    err_covers_bucket: {
      ar: 'مخزن صور الأغلفة غير موجود بعد: شغّل الملف _setup/supabase/books.sql مرة واحدة في SQL Editor.',
      en: 'The cover image storage does not exist yet: run _setup/supabase/books.sql once in the SQL Editor.',
      fr: 'Le stockage des couvertures n’existe pas encore : exécutez une fois _setup/supabase/books.sql dans le SQL Editor.'
    },
    // Footer
    footer_about: {
      ar: 'Delta Conception — دورات تطبيقية في نظم المعلومات الجغرافية، ومكتبة رقمية للكتب والمراجع.',
      en: 'Delta Conception — hands-on GIS training and a digital library of books and references.',
      fr: 'Delta Conception — formations pratiques en SIG et bibliothèque numérique de livres et de références.'
    },
    footer_courses_title: { ar: 'الدورات التدريبية', en: 'Training Courses', fr: 'Formations' },
    footer_library_title: { ar: 'المكتبة والمصادر', en: 'Library & Resources', fr: 'Bibliothèque & Ressources' },
    footer_contact_title: { ar: 'تواصل معنا', en: 'Contact Us', fr: 'Contactez-nous' },
    footer_all_rights: {
      ar: 'جميع الحقوق محفوظة',
      en: 'All rights reserved',
      fr: 'Tous droits réservés'
    }
  };

  var LOCK = document.documentElement.getAttribute('data-lock-lang');   // لوحة الإدارة: عربية دائماً
  var TITLES = {
    courses: 'courses_head_title', books: 'nav_books', program: 'prog_title', register: 'reg_title',
    resources: 'nav_resources', files: 'nav_files', admin: 'admin_title'
  };

  function valid(l) { return l === 'ar' || l === 'en' || l === 'fr'; }
  function getLang() {
    if (LOCK) return LOCK;
    var l = 'ar';
    try { l = localStorage.getItem(LANG_KEY) || 'ar'; } catch (e) {}
    return valid(l) ? l : 'ar';
  }

  // t(key, fallback): النص باللغة الحالية، ثم العربية، ثم البديل المعطى
  function t(key, fallback) {
    var item = DICT[key], cur = getLang();
    if (item) return item[cur] || item.ar;
    if (fallback !== undefined) return fallback;
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) console.warn('i18n: missing key', key);
    return key;
  }

  function setDir(l) {
    var h = document.documentElement;
    h.setAttribute('lang', l);
    h.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
  }

  function applyTranslations() {
    var cur = getLang();
    setDir(cur);
    // النص العربي الأصلي في HTML هو المرجع (قد يحتوي على وسوم مثل <span class="ltr">) ويُستعاد كما هو
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var item = DICT[el.getAttribute('data-i18n')];
      if (!item) return;
      if (el._ar === undefined) el._ar = el.innerHTML;
      if (cur === 'ar') { if (el.innerHTML !== el._ar) el.innerHTML = el._ar; }
      else el.textContent = item[cur] || item.ar;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (spec) {
        var parts = spec.split(':'), item = DICT[parts[1]];
        if (parts.length === 2 && item) el.setAttribute(parts[0], item[cur] || item.ar);
      });
    });
    var page = document.body && document.body.getAttribute('data-page');
    var S = window.SITE || {};
    if (page === 'home' && S.titles) document.title = S.titles[cur] || S.titles.ar;
    else if (TITLES[page] && DICT[TITLES[page]]) document.title = t(TITLES[page]) + ' — ' + (S.name || 'Delta Conception');
  }

  function setLang(lang) {
    if (LOCK || !valid(lang) || lang === getLang()) return;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    applyTranslations();
    window.dispatchEvent(new CustomEvent('deltalangchange', { detail: { lang: lang } }));
  }

  window.I18N = { getLang: getLang, setLang: setLang, t: t, dict: DICT, apply: applyTranslations };

  // السكربت يُحمَّل بخاصية defer: الصفحة مقروءة كاملة هنا، فنترجم النصوص الثابتة فوراً ثم نُظهر الصفحة
  // (كانت مخفية لحظياً لمنع وميض النص العربي؛ الأجزاء المتغيّرة فارغة في HTML وتملؤها السكربتات التالية باللغة الصحيحة)
  applyTranslations();
  document.documentElement.classList.remove('i18n-wait');
})();
