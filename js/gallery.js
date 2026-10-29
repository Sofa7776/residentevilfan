/* Какие фото показывать в личных делах, кадрах игр, местах и фильмах */
/* Фото: подпись — что изображено, cr — автор фанатской работы */
const PHOTOS={
 leon:{main:'p_leon',gal:[['p_leon98','1998 · новичок полиции','фан-арт, автор неизвестен'],['s_welcome','1998 · «добро пожаловать» в участке, ремейк RE2'],['p_leon04','2004 · ремейк RE4'],['p_leon','2026 · Requiem']]},
 chris:{main:'p_chris',gal:[['p_chris98','1998 · S.T.A.R.S.'],['p_chris','2009 · BSAA, RE5'],['p_chris06','CG-сериал «Бесконечная тьма»'],['p_chris21','2021 · Village, с малышкой Розой']]},
 jill:{main:'p_jill',gal:[['p_jill98','1998 · S.T.A.R.S., ранний арт'],['p_jill3','1998 · Немезис, ремейк RE3'],['p_jill','1998 · ремейк RE3']]},
 claire:{main:'p_claire',gal:[['p_claire','1998 · ремейк RE2'],['p_claire11','2011 · Revelations 2']]},
 ada:{main:'p_ada',gal:[['p_ada','2004 · ремейк RE4']]},
 sherry:{main:'p_sherry',gal:[['p_sherry','Взрослая Шерри, агент'],['s_sherryjake','2013 · Шерри и Джейк, RE6','фан-арт, подпись: 最爱吉尔']]},
 rebecca:{main:'p_rebecca',gal:[['s_rebillyre0','1998 · Ребекка и Билли, RE0']]},
 grace:{main:'p_grace',gal:[['p_grace','2026 · Requiem'],['s_graceemily','2026 · Грейс и Эмили, Requiem'],['s_alyssa','Алисса Эшкрофт, мать Грейс']]},
 ethan:{main:'p_leon_fan',gal:[['p_leon_fan','Итан Уинтерс','фан-арт: Demon 3D'],['s_chrisrose','2021 · Крис с малышкой Розой'],['s_ashley2','Роза Уинтерс, дочь Итана']]},
 barry:{main:'p_barry',gal:[['p_barry','2011 · Revelations 2']]},
 spencer:{main:'p_spencer',gal:[['s_spencer','Озвелл Спенсер в старости, RE5']]},
 wesker:{main:'p_wesker',gal:[['p_wesker','2009 · RE5'],['p_wesker_fan','Вескер','фан-арт, подпись: LAC']]},
};
const GAL={
 rev1:[['g_rev1','Обложка']],
 re0:[['s_rebillyre0','Ребекка и Билли в поезде'],['g_re0','Обложка']],
 cv:[['g_cv','Обложка','фанатский постер'],['s_heli','Подлёт к острову Рокфорт'],['pl_island','Остров Рокфорт'],['s_veronica','«Resident Evil Veronica», заставка из новостей']],
 re1:[['g_re1','Обложка'],['pl_mansion','Особняк'],['p_chris98','Крис, S.T.A.R.S.'],['p_jill98','Джилл, ранний арт']],
 re2:[['g_re2','Обложка'],['s_rpd','Холл полицейского участка'],['s_welcome','Гирлянда для Леона'],['s_mrx','Мистер Икс'],['p_leon98','Леон-новичок','фан-арт']],
 re3:[['g_re3','Обложка'],['s_jillnem','Немезис нападает на Джилл'],['s_carlos','Карлос Оливейра']],
 re4:[['g_re4','Обложка'],['p_leon04','Леон'],['pl_spain','Деревня в Испании'],['s_ashley','Эшли Грэм'],['s_luis','Луис Сера'],['s_krauser','Джек Краузер'],['p_ada','Ада Вонг']],
 re5:[['g_re5','Обложка'],['pl_kijuju','Крис и Шева в Кижуджу'],['p_chris','Крис'],['s_excella','Экселла Джионне'],['s_excella2','Шева Аломар, напарница Криса'],['p_wesker','Вескер'],['s_spencer','Озвелл Спенсер']],
 re6:[['g_re6','Обложка'],['s_helena','Хелена Харпер','фан-арт: franalcantara'],['s_sherryjake','Шерри и Джейк','фан-арт']],
 rev2:[['g_rev2','Обложка'],['p_claire11','Клэр'],['p_barry','Барри Бёртон']],
 re7:[['g_re7','Обложка'],['s_mia','Мия Уинтерс'],['s_bakergate','Ворота дома Бейкеров'],['s_bakers','Семья Бейкеров за ужином']],
 village:[['g_village','Обложка'],['s_castle','Замок Димитреску'],['s_council','Совет лордов'],['s_dimitrescu','Альсина Димитреску с дочерьми'],['s_sisters','Портрет дочерей Димитреску'],['s_statue','Статуя из замка'],['s_donna','Донна Беневьенто и Энджи'],['s_heisenberg','Карл Гейзенберг'],['s_miranda','Мать Миранда с Розой','фан-арт: @goldy_vp'],['s_ashley2','Роза Уинтерс, дочь Итана'],['s_chrisrose','Крис с малышкой Розой']],
 requiem:[['g_requiem','Обложка'],['p_grace','Грейс Эшкрофт'],['p_leon','Леон в 2026 году'],['p_sherry','Шерри Биркин'],['s_graceemily','Грейс и Эмили'],['s_alyssa','Алисса Эшкрофт, мать Грейс'],['s_gideon','Виктор Гидеон'],['s_monster9','Чудовище из Requiem']],
};
const PLACE_IMG={desert:'pl_kijuju',mansion:'pl_mansion',island:'pl_island',spain:'pl_spain',city:'pl_city',swamp:'s_bakergate',village:'s_castle'};
const FILM_IMG={inf:'fp_inf',re02:'fp_re02',re04:'fp_re04',re07:'fp_re07',re10:'fp_re10',re12:'fp_re12',re16:'fp_re16',degen:'fp_degen',damn:'fp_damn',vend:'fp_vend',death:'fp_death',re26:'fp_re26',re21:'fp_re21',net22:'fp_net22'};
const FILM_WIDE=new Set([]);
const FILM_POSTER=new Set(['re02','re04','re07','re10','re12','re16','degen','damn','vend','death','re26','net22','re21','inf']);
const FILM_GAL={inf:[['f_inf','Крис Редфилд'],['s_shenmay','Шен Мэй']],vend:[['fw_vend','Русский постер'],['f_vend','Свадьба Гленна Ариаса']],damn:[['fw_damn','Русский постер']],re21:[['fp_re21','Русский постер']],degen:[['fp_degen','Японский постер'],['fw_degen','Русский постер']],re12:[['fp_re12','Постер'],['fs_re12','Элис на полигоне «Амбреллы»']],re16:[['fp_re16','Постер','фанатский, не официальный']]};
