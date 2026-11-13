extends Control

const GAME_VERSION := "2.6.0"
const AVAILABLE_ROUNDS: Array[int] = [5, 8, 10, 15]
const BG := Color("071e36")
const BG_DEEP := Color("041326")
const NAVY := Color("0c2e4f")
const PANEL := Color("103d61")
const PANEL_SOFT := Color("145276")
const CREAM := Color("fff4dc")
const MUTED := Color("a7c7d9")
const CYAN := Color("6de5e8")
const CORAL := Color("ff8068")
const YELLOW := Color("ffd36e")
const GREEN := Color("87e6ad")
const PURPLE := Color("c5a9ff")

var screen := "title"
var round_index := 0
var heart := 42
var radar := 28
var boundary := 50
var chain := 0
var score := 0
var selected_round_count := 8
var round_count := 8
var current_event: Dictionary = {}
var selected_choice := -1
var answer_locked := false
var ending_key := ""
var best_score := 0
var showing_how := false

var title_layer: Control
var title_panel: PanelContainer
var title_hint: Label
var how_button: Button
var round_select: OptionButton

var play_layer: Control
var round_label: Label
var round_progress: ProgressBar
var event_panel: PanelContainer
var event_badge: Label
var event_title: Label
var event_sender: Label
var event_message: Label
var event_detail: Label
var action_row: HBoxContainer
var bite_button: Button
var observe_button: Button
var leave_button: Button
var next_button: Button
var feedback_label: Label
var status_panel: PanelContainer
var heart_value: Label
var radar_value: Label
var chain_value: Label
var score_value: Label
var heart_bar: ProgressBar
var radar_bar: ProgressBar
var boundary_value: Label
var boundary_bar: ProgressBar
var play_tip: Label

var result_layer: Control
var result_panel: PanelContainer
var result_kicker: Label
var result_title: Label
var result_summary: Label
var result_stats: Label
var replay_button: Button
var title_button: Button

var events: Array = [
	{
		"type": "早安晚安型", "icon": "☀️", "title": "每天都說早安晚安", "sender": "@溫柔海浪",
		"message": "早安～晚安～今天也要想你喔 ❤️", "detail": "但你一問「最近好嗎？」，對方就已讀到海底。", "best": 1,
		"bait_color": CORAL
	},
	{
		"type": "突然消失型", "icon": "🫥", "title": "昨天還在，今天蒸發", "sender": "@神秘水母",
		"message": "昨天：你是我最特別的人。\n今天：最後上線 23 小時前。", "detail": "這不是魔術，是把你放進冷凍庫的技術。", "best": 2,
		"bait_color": PURPLE
	},
	{
		"type": "深夜出沒型", "icon": "🌙", "title": "凌晨 01:37 的一句話", "sender": "@夜光魷魚",
		"message": "睡了嗎？\n現在出來見面，海邊風很大。", "detail": "白天訊息已讀，晚上突然變成浪漫電影主角。", "best": 1,
		"bait_color": YELLOW
	},
	{
		"type": "群發撒網型", "icon": "🕸️", "title": "同一句話，漂到你這裡", "sender": "@全海域已送達",
		"message": "嗨寶～我第一眼就覺得你很不一樣 ✨", "detail": "你往旁邊一看，整片海都有同款餌。", "best": 2,
		"bait_color": CORAL
	},
	{
		"type": "未來支票型", "icon": "🧾", "title": "等有空一定帶你看海", "sender": "@明天一定",
		"message": "等我忙完這陣子，我們就去旅行。\n（這句已經拖三季。）", "detail": "未來很美，只是永遠還沒排進行事曆。", "best": 1,
		"bait_color": CYAN
	},
	{
		"type": "情緒索取型", "icon": "🫠", "title": "只回你一句就說很忙", "sender": "@需要被陪伴",
		"message": "我今天好累，可以陪我聊四小時嗎？\n你說你也累：喔那先這樣。", "detail": "你的情緒不是 24 小時便利商店。", "best": 2,
		"bait_color": PURPLE
	},
	{
		"type": "真誠稀有型", "icon": "🪸", "title": "這次的餌，好像有點不一樣", "sender": "@慢慢靠岸",
		"message": "我喜歡跟你聊天，也尊重你的節奏。\n不急，你想回再回就好。", "detail": "警報沒有響，心裡卻有小魚在跳。", "best": 0,
		"bait_color": GREEN
	},
	{
		"type": "迷因回彈型", "icon": "🐡", "title": "只有你懂的那張梗圖", "sender": "@懂你梗的人",
		"message": "（傳來一張只有你們笑得出來的迷因）\n「這不就是你嗎？」", "detail": "危險訊號：你真的笑了，而且想回一張。", "best": 0,
		"bait_color": CYAN
	}
]

const GEMINI_SCENARIOS: PackedStringArray = [
	"凌晨 02:15，對方突然傳來：「其實我剛剛點進去看你的限動，看著看著就哭了一下...」",
	"聊到一半人突然不見，隔了整整 5 天後傳來：「哈哈哈哈這張貼圖好好笑。」（完全當沒事）",
	"「我覺得我如果去參加大胃王比賽一定會贏你。」",
	"「今天走在路上，突然看到一個背影超像你的，害我心跳漏了一拍。」",
	"傳了一張路邊野貓的照片：「它剛剛瞪了我一眼，跟你生氣的樣子一模一樣。」",
	"「等我忙完這陣子，一定要帶你去吃那家超難訂的私廚料理！」",
	"「如果今天世界末日，你只能帶我走或是帶一箱珍奶，你選哪個？」",
	"中午 12:40 傳來：「早安～今天夢到你了，但我忘記內容是什麼哈哈。」",
	"「我朋友最近單身，一直在問我認識什麼正妹/帥哥，我就把你的照片給他看了一下...」",
	"「你今天回訊息好冷淡，是不是在外面有別的狗狗了？」",
	"「今天的雲長得很像一隻失落的鯨魚，莫名覺得很孤單。」",
	"「聽說這週末好像會展覽那個很有名的藝術祭，可惜沒人陪我去。」",
	"「你知道為什麼小明去買飲料都不用排隊嗎？因為他很『魚』蠢...好啦這不是重點，在幹嘛？」",
	"（突然傳來一則 0 分 02 秒的語音訊息，點開只有一聲嘆氣跟背景風聲）",
	"「寶貝，這禮拜的聚餐地點訂好了喔——（隔了 5 秒）啊對不起傳錯了，不是傳給你。」",
	"（連續按了你五則限時動態愛心，然後傳來）：「好羨慕你每天都過得這麼精彩喔。」",
	"「我覺得我們如果玩真心話大冒險，你一定會輸得很慘。」",
	"「在幹嘛？」",
	"「我剛剛算塔羅牌，上面說我最近會遇到一個『命中註定的劫』，該不會就是你吧？」",
	"「今天天氣很好，突然覺得身邊如果少了一個你好像怪怪的。」",
	"對方傳來一則 1 分鐘的語音，點開發現裡面只有吃洋芋片的「喀滋喀滋」聲跟背景電視聲，最後笑了一下說：「好無聊喔。」",
	"「我看你打字的速度，覺得你絕對是個控制欲超強的星座，猜中要請我喝飲料。」",
	"「[轉發貼文]：『真正喜歡一個人，是會忍不住想把全世界最好的都給他。』—— 哎呀，這篇按到分享，怎麼發出來了（尷尬笑）」",
	"凌晨 01:00 傳來：「不管別人怎麼看你，在我眼裡你一直是個很特別的存在。」",
	"下午 15:30 傳來：「早安～今天也是為了生活努力打拼的一天呢！」",
	"「我覺得你一定是很挑食的小孩，吃東西絕對會把青菜挑掉的那種。」",
	"隔了兩天沒回訊息，突然傳來：「欸我昨天夢到我們一起去爬山，超真實的，你有夢到我嗎？」",
	"「我看你限動跟別人出去玩得很開心嘛，果然我對你來說一點都不重要。」",
	"「如果今天有一隻魚在水裡哭，眼淚會流出來嗎？就像我現在的心情一樣。」",
	"「今天去吃那家米其林餐廳，結果隔壁桌一直看我，覺得有點困擾哈哈。」",
	"「[分享歌曲]：周興哲 - 《你，好不好？》—— 突然聽到這首，覺得好適合現在的心情。」",
	"「如果等下見面，我直接牽你的手，你會甩開嗎？」",
	"「我覺得你長得一副很愛吃鹽酥雞的樣子，是不是？」",
	"（傳了一張自己戴口罩的自拍，寫著：「今天長這樣，評分一下？」）",
	"「好累喔，今天開了八個會議，回覆你已經是我今天唯一的精神糧食了。」",
	"「我今天看到一隻哈士奇在路邊傻笑，長得跟你一模一樣。」",
	"「如果我和你最好的朋友同時掉進水裡，你會先救誰？」",
	"「還有 3 天，我就要解鎖一件關於你的秘密了。」",
	"「你剛剛居然回我貼圖敷衍我！我要生氣三分鐘，不理你了氣氣氣。」",
	"「我們不用再當朋友了，直接原地交往吧，開玩笑的啦（哈哈）」",
	"「我覺得我們再這樣聊下去，我一定會忍不住喜歡上你...怎麼辦？」",
	"（突然傳來一張俯視角度的素顏照）：「剛剛剛洗完澡，髮型是不是很爆笑？」",
	"「如果我現在去你家找你，你會幫我開門嗎？」",
	"「你剛才限動標記的那個人是誰？感覺你們感情很好捏～」",
	"「這週末好無聊喔，不知道某人有沒有空陪我出去走走～」",
	"「有時候覺得世界很大，但能真正懂我的人好像只有你一個。」",
	"（連續傳了 10 張哭泣跟討抱抱的企鵝貼圖，沒有文字）",
	"「我覺得我好像不是你喜歡的類型，我是不是該自動退出了？」",
	"「我昨天夢到我們結婚了，結果婚禮上你居然臨陣脫逃！」",
	"「嗨～未來的女朋友/男朋友，今天過得好嗎？」",
	"（傳來一段 15 秒語音，清唱走音的《情歌王》）：「剛剛突然想唱給你聽～」",
	"「今天星座運勢說我幸運色是粉紅色，幸運對象是姓名開頭是 X 的人，是不是在說你？」",
	"「我覺得我最近胖了兩公斤，我是不是變成肥宅/胖妹了？（哭）」",
	"「其實我平常不常跟別人聊這麼多，你真的滿特別的。」",
	"晚上 23:30 傳來：「要不要出來吃宵夜？我開車去載你。」",
	"（傳了一張健身房腹肌/腿部照）啊糟糕！發錯人了，原本要發限動的。",
	"「如果有一天我突然消失在你的世界裡，你會找我嗎？」",
	"「你可以借我 50 塊買珍奶嗎？我下次見面用一輩子還你。」",
	"「如果我們在平行宇宙相遇，你覺得我們會是什麼關係？」",
	"「聊了這麼多，你到底有沒有一點點...喜歡我？」"
]

const EXTRA_SCENARIOS: PackedStringArray = [
	"「氣象局說今天晚上會下雨，你出門記得帶傘...噢對了，我只是順便說，不是特別關心你喔（傲嬌）」",
	"「欸我們之前是不是在哪裡見過？總覺得你長得跟我下一任男朋友/女朋友長得一模一樣。」",
	"凌晨 01:20 傳來：「好想吃巷口那家鹹酥雞，如果現在有人陪我去買，我一輩子都會記得他的好。」",
	"「如果你是一隻動物，你覺得你會是那種會把家裡沙發抓爛的貓，還是只會傻笑的黃金獵犬？」",
	"「老實交代，你的真實身高到底有沒有 175/160？這攸關我今天要不要穿高跟鞋/內增高。」",
	"「其實我私底下跟螢幕上長得完全不一樣，朋友都說我是雙重人格，你怕了嗎？」",
	"「我們來打賭，如果我明天考試/上班全勤，你要答應我一個要求。」",
	"「剛剛看到這杯手搖飲買一送一，可惜我只有一個人喝不完，真浪費。」",
	"「[分享歌曲]：告五人 - 《唯一》—— 聽著聽著突然覺得，這歌詞寫得真好。」",
	"「敢不敢現在拍一張你翻白眼的醜照傳給我，看誰比較醜？」",
	"「手機一直狂震，剛剛一口氣收到三個追求者的訊息，覺得有點困擾哈哈。」",
	"「如果我們老了以後一起去養老院，你覺得我們會是在裡面鬥嘴還是打麻將？」",
	"「我覺得你剛剛回我的那句話帶有情緒，是不是對我有什麼不滿？」",
	"「你今天打字的標點符號用得特別優雅，莫名有一種文豪的氣質。」",
	"「其實我今天心情有點低落，但不知道為什麼，跟你聊完突然好多了。」",
	"「你知道什麼動物最喜歡問別人問題嗎？是『海豹』，因為牠總是問『豹歉，請問...』」",
	"「來比看誰能在 3 秒內打出『我是戀愛小天才』這七個字，輸的人請喝飲料。」",
	"「你剛剛已讀我兩分鐘！你知道這兩分鐘對我來說有多煎熬嗎？」",
	"「如果一隻魚在交友軟體上滑手機，牠滑到的到底是其他魚，還是人類的誘餌？」",
	"「如果我現在跟你說『我喜歡你』，你會覺得我是認真的還是在開玩笑？」",
	"「深夜不睡覺都在幹嘛？老實招來，是不是在偷偷想我？」",
	"「房間燈泡壞掉了，黑漆漆的一片好可怕，如果有人能來幫我就好了...」",
	"「我看你就是那種嘴硬心軟、標準口是心非的星座，我沒說錯吧？」",
	"「突然好想聽聽你的聲音，要不要直接打一通語音電話來聽聽？」",
	"「談戀愛最重要的就是互相坦誠跟陪伴，你覺得呢？」",
	"「我覺得我今天運氣超好，居然在路上撿到十塊錢，這是不是代表你會出現？」",
	"「如果有一天我們去夜市，我把好吃的都給你吃，你怎麼報答我？」",
	"「剛剛看到你回覆別人限動回得很開心嘛，哼，果然我有跟沒有一樣。」",
	"「我夢到你變成了一隻會飛的魚，帶著我在夜空中遨遊，這代表什麼意思？」",
	"「拜託啦～答應我嘛！好不好嘛好不好嘛（瘋狂傳撒嬌貼圖）」",
	"「剛剛多吃了一塊蛋糕，覺得罪惡感超重，你要負責安慰我！」",
	"「其實我平常是不太跟交友軟體的人聊這麼多的，你算是一個特例。」",
	"「看著窗外的夜景突然覺得好空虛，如果這時候你在旁邊就好了。」",
	"「猜我最近胖了還是瘦了？猜中請你喝飲料，猜錯你請我。」",
	"「我喜歡……（刪除線）……今天天氣真的不錯對吧哈哈（尷尬）」",
	"「數到三，請同時心裡想一個數字！1、2、3……你剛剛想幾？」",
	"「今天滑手機滑到睡著，醒來發現全世界只剩我一個人還醒著，好孤單。」",
	"「我今天穿了一件超奇葩的衣服出門，你覺得我會是全場焦點還是全場笑話？」",
	"「如果你覺得跟我聊天很有壓力，其實你可以直說沒關係的，我不會勉強你。」",
	"「……（傳了一個問號貼圖，然後已讀不回）」",
	"「都幾點了還不回訊息，害我以為你被哪裡的浪潮給沖走了。」",
	"「從你剛剛打字的字句分析，你絕對是一個外表高冷、內心其實極度缺乏安全感的小可愛。」",
	"「[傳了一張超邪惡的宵夜炸雞排照片]：『深夜放毒，不能只有我胖到。』」",
	"「考考你，我們第一次聊天的時候，我跟你說的第一句話是什麼？答錯有懲罰。」",
	"「我看今天新聞說你們那區午後雷雨超大，你該不會淋成落湯雞了吧？」",
	"「如果平行時空的我們是仇人，你覺得我們第一句話會互罵什麼？」",
	"「聽說你手遊很強？敢不敢上線來單挑一把，輸的人要聽對方一個條件。」",
	"「好啦，既然你都不想主動找話題，那我也要開始冷落你了，哼。」",
	"「我養的倉鼠剛剛生氣咬了我一口，長得跟你生氣的樣子一模一樣，太可愛了。」",
	"「你五年後覺得自己會在幹嘛？會不會已經結婚生子，把我忘得一乾二淨？」",
	"「跟你聊天的時候，我的心跳總是會莫名其妙變快，這是不是一種生病的徵兆？」",
	"「你今天發的那張限動，光影剛好把你的臉修飾得像明星一樣，是不是有偷偷修圖？」",
	"「有時候覺得長大好累，明明身邊都是人，卻沒有一個能真正說心裡話。」",
	"「跟你借個東西好不好？借我你的『未來』，剩下的餘生我來還你。」",
	"「你覺得分手後還能跟前任當朋友嗎？我最近遇到這個難題了...」",
	"「今天雨下得這麽大，我的心情也跟著濕漉漉的，你呢？」",
	"「我覺得你的智商絕對小學沒畢業，不然怎麼連這個梗都聽不懂？」",
	"「我以後挑另一半的條件很簡單，只要像你這樣...（隔 3 秒）...的對立面就好哈哈。」",
	"「我剛剛出門踩到一隻大黃狗的尾巴，牠回頭瞪了我一眼，害我嚇得差點跌倒。」",
	"「如果我現在許願，希望手上的珍奶立刻變成你在我旁邊，你覺得實現的機率有多高？」",
	"凌晨 02:00 傳來：「突然好想去 KTV 唱五月天，你要不要當我的專屬聽眾？」",
	"「欸，我們是怎麼認識的啊？我記憶力不好，你提醒我一下。」",
	"「上次聽你講話覺得你的聲音超有磁性，可以當Podcast主持人了。」",
	"「我看你打字的手速這麼快，手指一定長得很修長漂亮對吧？」",
	"「你剛剛回我那句話是什麼意思？是不是在偷偷嫌棄我笨？」",
	"「如果外星人突然綁架我們兩個，你覺得牠們第一句話會對我們說什麼？」",
	"「今天工作被主管罵超慘，覺得人生好難，求安慰、求抱抱。」",
	"「如果我們走在路上，身高差這麼多，會不會看起來像爸爸帶女兒/媽媽帶兒子？」",
	"「我今天抽到籤詩是大吉，上面說會遇到命中注定的良緣，該不會就是你吧？」",
	"「如果我們去約會，你會選擇去高級餐廳吃燭光晚餐，還是去路邊吃滷肉飯？」",
	"「我昨天穿什麼顏色的衣服出門？給你三秒鐘，答不出來今晚沒宵夜。」",
	"「好啦，看你回訊息這麼敷衍，我就不勉強你陪我聊天了，你去忙吧。」",
	"「我覺得你今天就像一杯半糖去冰的珍奶，甜而不膩，讓人回味無窮。」",
	"「突然想到明透還有好多事情沒做，焦慮到睡不著，陪我聊天聊到天亮好不好？」",
	"「外面好冷，我的手冰得跟冰棒一樣，如果這時候有人可以牽一下就好了...」",
	"「寶貝，今晚記得吃藥喔——（隔 5 秒）……哎呀又傳錯人了好尷尬。」",
	"「身為一隻魚，你覺得我們最大的天敵到底是人類的魚鉤，還是自己的暈船體質？」",
	"「如果有一天我變得一無所有、又窮又醜，你還會理我嗎？」",
	"「我覺得我今天帥/美到發光，走在路上連路人都忍不住回頭看我兩眼。」",
	"「你剛剛居然已讀我超過半小時！我要把你列入我的黑名單！」",
	"上午 11:59 傳來：「早安～今天也是充滿希望的一天，你有想我嗎？」",
	"「其實我剛剛對你說了謊，我根本不是在忙，我只是不知道怎麼回你訊息。」",
	"「傳一張你現在翻白眼的醜照來，不然我就要發我小時候尿床的照片囉！」",
	"「如果你真的遇到比我更好的人，一定要記得告訴我，我會含淚祝福你的。」",
	"「敢不敢跟我玩一個遊戲？接下來的一小時內，誰先回訊息誰就請喝飲料。」",
	"「深夜總是特別容易讓人胡思亂想，例如……我在想你現在到底有沒有在想我。」",
	"「我今天買了一包超難吃的洋芋片，本想分你吃一包，現在決定自己受罪就好。」",
	"「如果我們以後生的小孩長得像你，那脾氣一定跟你一樣倔強。」",
	"「聽說深海的魚都沒有眼睛，只靠感覺摸索方向，我覺得我們現在就像深海的魚。」",
	"「老實說，你第一次看到我照片的時候，心裡第一個浮現的念頭是什麼？」",
	"「我覺得我今天可以跑操場十圈，不信我們現在去操場比一場！」",
	"「你剛剛回我的表情符號太冷淡了！只有一個句號，是不是在敷衍我？」",
	"「突然覺得自己的人生好失敗，什麼事情都做不好，好想找個洞把自己埋起來。」",
	"「下次見面，我可以直接把你的心偷走嗎？不用還的那種。」",
	"「如果你心裡還有別人的話，可以直接跟我說，我不會纏著你的。」",
	"「我剛剛不小心把咖啡打翻在鍵盤上，現在鍵盤正在發出滋滋的慘叫聲。」",
	"「如果愛情是一場馬拉松，你覺得我們現在跑到了第幾公里？」",
	"「你睡覺的時候會不會流口水？我聽說會流口水的都是心思單純的人。」",
	"「老實交代，你真實年齡是不是比身分證上寫的大十歲？看起來有點老成哈哈。」",
	"「睡不著，上來看看你在幹嘛。結果發現你不在，覺得有點失落。」",
	"「今天星座運勢說我諸事不順，果然一開口跟你聊天就被你句點，太準了吧。」",
	"「好啦，大老闆要開會了，暫時不能回你訊息，乖乖在家等我回來喔。」",
	"「你心目中的理想型條件到底是什麼？列出三個出來，我看看我有沒有符合。」",
	"「我覺得你今天看起來特別像一隻慵懶的樹懶，慢吞吞的超好笑。」",
	"「你剛剛居然已讀不回我的貼圖！這已經是本週第三次了，我要提出抗議！」",
	"「如果我們在平行宇宙裡是一隻貓跟一條魚，你覺得你會先吃我還是我先逃跑？」",
	"「如果我們現在走在路上被狗仔拍到，你覺得隔天的頭條標題會是什麼？」",
	"「如果我現在親手煮一碗泡麵給你吃，你會不會感動到痛哭流涕？」",
	"「以後如果我們養一隻狗，你覺得要叫『小黑』還是叫『你的名字』？」",
	"「世界上有那麼多人，為什麼偏偏是你滑到了我、我也滑到了你？這是不是緣分？」",
	"「我今天出門不小心穿錯鞋子，一隻球鞋一隻拖鞋，居然還走了半條街才發現。」",
	"「突然覺得時間過得好快，一轉眼又過了一天，而我們好像還是老樣子。」",
	"「我發燒了，頭昏腦脹的。你能不能隔著螢幕給我傳一點溫暖過來？」",
	"「親愛的，晚上記得幫我留門——（隔 3 秒）……哎呀又發錯群組了，真糗。」",
	"「如果大海裡的每一滴水都是我對你的想念，那你現在應該已經被淹沒了吧？」",
	"「如果有一天我消失一個禮拜完全聯絡不上，你會不會急到報警？」",
	"「我覺得我上輩子一定拯救了銀河系，這輩子才能在交友軟體遇到像我這麼有趣的人。」",
	"「你剛剛回我的訊息居然只用『嗯』敷衍我！我要沒收你今天跟聊天的一小時資格！」",
	"「今天星座運勢說不宜出門、不宜談戀愛，難怪我今天一整天都在想你，犯了忌諱。」",
	"「好啦，不跟你鬧了。認真問一句：你對我到底有沒有感覺？一句話回答。」",
	"凌晨 03:00 傳來：「睡不著，腦海裡一直浮現我們剛剛聊天的畫面，覺得自己好像有點陷下去了。」",
	"已讀不回三個禮拜後突然傳來：「嗨！最近過得怎麼樣？我有買一個小禮物要送你。」",
	"「我覺得我如果去參加辯論比賽，絕對能把你辯到哭出來，要不要試試看？」",
	"「今天出門沒帶傘，結果突然下大雨，狼狽得要死，超希望這時候有人能來接我。」",
	"傳了一張天空雲朵的照片：「這朵雲長得好像一隻正在對你微笑的鯊魚，超詭異。」",
	"「等我存夠錢，一定帶你去環遊世界，第一站就去你想去的國家！」",
	"「如果今天必須在『一輩子不能吃肉』跟『一輩子不能跟我聊天』選一個，你選哪個？」",
	"下午 16:45 傳來：「早安～今天過得怎麼樣？不好意思剛睡醒有點恍惚。」",
	"「我今天跟朋友聊天，不小心把你的名字講出來了，結果他們一直逼問我們是什麼關係...」",
	"「你今天回訊息的字數比昨天少了一半，是不是對我厭煩了、想甩掉我了？」",
	"「夕陽西下，斷腸人在天涯。而我在這裡想著你，莫名覺得淒涼。」",
	"「聽說最近那家新開的貓咪咖啡廳超難訂位，不過我剛好有朋友多出兩張票...」",
	"「你知道什麼車最會跳舞嗎？是『U-bike』，因為它有『YOU-bike（You 擺個）』...好冷對不起。」",
	"（突然傳來一則 0 分 05 秒的語音，點開裡面只有打呼聲跟一聲夢話）",
	"「寶貝我愛你——（隔 3 秒）……哎呀傳錯了，是要傳給群組的。」",
	"（連續按了你十則限時動態讚，然後傳來）：「看來你今天的生活過得非常充實嘛。」",
	"「我覺得我們如果玩真心話大冒險，你一定會被我問到直接哭著求饒。」",
	"「嗨，在幹嘛？（隔了 2 小時）……噢看來你也在忙，那我先去忙了。」",
	"「我昨天去廟裡拜拜抽到一支籤，上面寫著『遠在天邊，近在眼前』，說的就是你對吧？」",
	"「200 個回合的聊天挑戰終於結束了。最後一題：你到底要繼續當一條游來游去的魚，還是決定靠岸定居？」"
]

const EXTRA_SCENARIO_TITLES: PackedStringArray = [
	"莫名其妙的氣象播報",
	"假裝健忘的搭訕",
	"深夜肚子餓的陷阱",
	"無厘頭的動物對比",
	"突如其來的靈魂拷問（身高篇）",
	"假裝自己很神祕",
	"莫名其妙的打賭",
	"假裝不經意的貼心",
	"突如其來的音樂分享",
	"奇怪的拍照挑戰",
	"假裝自己很搶手",
	"無厘頭的未來想像",
	"莫名其妙的敏感話題",
	"突如其來的誇獎（但怪怪的）",
	"假裝不小心透露心事",
	"奇怪的諧音梗 2.0",
	"莫名其妙的勝負欲（手速篇）",
	"假裝生氣的討拍",
	"突如其來的哲學思辨",
	"毫無鋪陳的直球告白（試探版）",
	"莫名其妙的熬夜理由",
	"假裝柔弱的裝潢求助",
	"莫名其妙的星座黑特",
	"突如其來的深夜視訊邀約",
	"假裝大方的感情觀分享",
	"莫名其妙的日常比較",
	"突如其來的靈魂拷問（美食篇）",
	"假裝不經意的吃醋",
	"無厘頭的夢境解析",
	"毫無預警的撒嬌大絕",
	"莫名其妙的熱量計算",
	"假裝高冷的試探",
	"突如其來的深夜感性",
	"奇怪的體重賭局",
	"假裝失誤的告白",
	"莫名其妙的默契考驗",
	"突如其來的孤單寂寞",
	"奇怪的穿搭審查",
	"假裝大方的放手",
	"百搭題：終極已讀",
	"莫名其妙的起床氣",
	"假裝很懂心理學",
	"突如其來的深夜放毒",
	"奇怪的記憶力考驗",
	"假裝不經意的關心",
	"無厘頭的平行時空對話",
	"突如其來的勝負欲（遊戲篇）",
	"假裝生氣的冷戰",
	"莫名其妙的寵物認親",
	"突如其來的靈魂拷問（未來規劃）",
	"假裝害羞的直球",
	"莫名其妙的誇獎（外貌篇）",
	"突如其來的深夜emo",
	"奇怪的借錢起手式 2.0",
	"假裝不經意的試探（前任篇）",
	"無厘頭的天氣對話",
	"突如其來的挑釁（智商篇）",
	"假裝大方的伴侶條件",
	"莫名其妙的日常回報",
	"突如其來的浪漫陷阱",
	"莫名其妙的深夜唱歌邀約",
	"假裝失憶的套路",
	"突如其來的誇獎（聲音篇）",
	"奇怪的身體部位對號入座",
	"假裝生氣的已讀",
	"無厘頭的宇宙思考",
	"突如其來的深夜討抱",
	"假裝不經意的試探（身高差篇）",
	"莫名其妙的幸運數字",
	"突如其來的靈魂拷問（約會篇）",
	"奇怪的記憶大考驗",
	"假裝大方的「放生」",
	"莫名其妙的日常對比",
	"突如其來的深夜恐慌",
	"奇怪的體溫分享",
	"假裝不小心傳錯的情話",
	"無厘頭的魚類對話",
	"突如其來的深夜靈魂拷問",
	"奇怪的自信爆棚",
	"假裝生氣的抗議",
	"莫名其妙的早安問候 3.0",
	"突如其來的深夜告解",
	"奇怪的拍照角度測試",
	"假裝大方的祝福",
	"莫名其妙的日常挑戰",
	"突如其來的深夜感性 2.0",
	"奇怪的零食分享",
	"假裝不經意的試探（未來小孩篇）",
	"無厘頭的海底生物對話",
	"突如其來的深夜靈魂拷問（真心話篇）",
	"莫名其妙的體能挑戰",
	"假裝生氣的抗議 2.0",
	"突如其來的深夜emo 2.0",
	"奇怪的借物預告",
	"假裝大方的感情放手",
	"莫名其妙的日常對話 2.0",
	"突如其來的浪漫陷阱 2.0",
	"奇怪的睡姿分享",
	"假裝不經意的試探（年齡篇）",
	"百搭題：深夜直球",
	"莫名其妙的運勢黑特",
	"假裝很忙的CEO",
	"突如其來的深夜靈魂拷問（理想型篇）",
	"奇怪的動物對號入座 2.0",
	"假裝生氣的已讀 2.0",
	"無厘頭的平行宇宙 2.0",
	"突如其來的深夜放閃（假想）",
	"奇怪的烹飪挑戰",
	"假裝不經意的試探（未來規劃篇 2.0）",
	"突如其來的浪漫陷阱 3.0",
	"莫名其妙的日常回報 2.0",
	"突如其來的深夜emo 3.0",
	"奇怪的體溫分享 2.0",
	"假裝不小心傳錯的情話 2.0",
	"無厘頭的海底生物對話 2.0",
	"突如其來的深夜靈魂拷問（信任篇）",
	"奇怪的自信爆棚 2.0",
	"假裝生氣的抗議 3.0",
	"莫名其妙的運勢黑特 2.0",
	"百搭題：終極直球對決",
	"深夜突襲型 2.0",
	"毫無邏輯的消失 2.0",
	"莫名其妙的勝負欲 2.0",
	"釣魚大師的釣語 2.0",
	"莫名其妙的分享欲 2.0",
	"畫大餅型 2.0",
	"莫名其妙的心理測驗 2.0",
	"奇怪的早安問候 3.0",
	"假裝不經意的試探 2.0",
	"莫名其妙的情緒勒索 2.0",
	"突然的文青上身 2.0",
	"試探性邀約但超被動 2.0",
	"奇怪的諧音梗或冷笑話 2.0",
	"毫無預警的深夜語音 2.0",
	"假裝失誤的傳錯訊息 2.0",
	"無止盡的限動回覆 2.0",
	"奇怪的挑釁 2.0",
	"沒話找話的尷尬起手式 2.0",
	"裝神弄鬼型 2.0",
	"暈船模擬器的終極收尾"
]

var round_deck: Array = []

func _build_event_bank() -> void:
	events.clear()
	var all_scenarios: PackedStringArray = GEMINI_SCENARIOS.duplicate()
	all_scenarios.append_array(EXTRA_SCENARIOS)
	var specs: Array = [
		["夜半試探型", "🌙", "夜光魷魚", "凌晨的訊息最會放大心動。", YELLOW],
		["消失回彈型", "🫥", "神秘水母", "消失後若無其事，是海域常見的回馬槍。", PURPLE],
		["曖昧挑釁型", "🎣", "珊瑚小丑魚", "玩笑裡有一點真心，也有一點試探。", CORAL],
		["日常投餌型", "☀️", "溫柔海浪", "看似普通的關心，最容易讓魚靠近。", CYAN],
		["情緒勒索型", "🫠", "委屈河豚", "可愛的抱怨，也可能是把責任丟給你。", PURPLE],
		["未來支票型", "🧾", "明天一定", "說得很遠很美，但行事曆上沒有日期。", YELLOW],
		["真誠靠岸型", "🪸", "慢慢靠岸", "尊重節奏的訊息，才是值得觀察的稀有魚餌。", GREEN]
	]
	var best_choices: Array[int] = [1, 2, 0, 1, 2, 0]
	for index: int in all_scenarios.size():
		var spec: Array = specs[index % specs.size()]
		events.append({
			"type": spec[0],
			"icon": spec[1],
			"title": (EXTRA_SCENARIO_TITLES[index - GEMINI_SCENARIOS.size()] if index >= GEMINI_SCENARIOS.size() else "%s · 第 %02d 則" % [spec[0], index + 1]),
			"sender": "@%s%d" % [spec[2], index + 1],
			"message": all_scenarios[index],
			"detail": spec[3],
			"best": best_choices[index % best_choices.size()],
			"bait_color": spec[4]
		})

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	mouse_filter = Control.MOUSE_FILTER_PASS
	resized.connect(_layout_ui)
	_build_event_bank()
	_build_title()
	_build_play()
	_build_result()
	_layout_ui()
	_show_title()
	queue_redraw()

func _process(_delta: float) -> void:
	queue_redraw()

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_ESCAPE:
			if screen == "play":
				_show_title()
			elif screen == "result":
				_show_title()
			get_viewport().set_input_as_handled()
			return
		if screen == "title" and event.keycode in [KEY_ENTER, KEY_SPACE]:
			_start_game()
			get_viewport().set_input_as_handled()
		elif screen == "play" and not answer_locked:
			if event.keycode == KEY_1:
				_choose(0)
			elif event.keycode == KEY_2:
				_choose(1)
			elif event.keycode == KEY_3:
				_choose(2)
			get_viewport().set_input_as_handled()
		elif screen == "play" and answer_locked and event.keycode in [KEY_ENTER, KEY_SPACE]:
			_advance_round()
			get_viewport().set_input_as_handled()

func _draw() -> void:
	var w := size.x
	var h := size.y
	draw_rect(Rect2(Vector2.ZERO, size), BG)
	# 深海暈光與大面積色塊，讓所有卡片都像漂在海裡。
	draw_circle(Vector2(w * 0.78, h * 0.22), minf(w, h) * 0.42, Color(0.05, 0.31, 0.48, 0.16))
	draw_circle(Vector2(w * 0.16, h * 0.86), minf(w, h) * 0.34, Color(0.10, 0.20, 0.42, 0.22))
	for i in range(9):
		var bx := fmod(float(i * 151 + 47), maxf(w, 1.0))
		var by := fmod(float(i * 93 + 31), maxf(h, 1.0))
		var r := 3.0 + float(i % 3) * 2.0
		draw_circle(Vector2(bx, by), r, Color(0.43, 0.90, 0.91, 0.18))
		draw_arc(Vector2(bx, by), r + 4.0, 0.0, TAU, 18, Color(0.43, 0.90, 0.91, 0.08), 1.0)
	# 海底水平波紋。
	for wave in range(4):
		var y := h - 70.0 - float(wave) * 28.0
		var points := PackedVector2Array()
		for x in range(0, int(w) + 40, 40):
			points.append(Vector2(float(x), y + sin(float(x) * 0.018 + float(wave)) * 5.0))
		draw_polyline(points, Color(0.38, 0.83, 0.88, 0.08 - float(wave) * 0.012), 2.0)
	if screen == "title":
		_draw_hook(Vector2(w * 0.84, h * 0.10), 0.9)
		_draw_fish(Vector2(w * 0.74, h * 0.52), 1.48, "happy")
	elif screen == "play":
		_draw_hook(Vector2(w * 0.88, h * 0.23), 0.56)
		_draw_fish(Vector2(w * 0.86, h * 0.75), 0.78, _play_mood())
	elif screen == "result":
		_draw_hook(Vector2(w * 0.82, h * 0.10), 0.78)
		_draw_fish(Vector2(w * 0.77, h * 0.60), 1.25, ending_key)

func _draw_fish(center: Vector2, scale_factor: float, mood: String) -> void:
	var body := PackedVector2Array()
	for i in range(32):
		var a := TAU * float(i) / 32.0
		body.append(center + Vector2(cos(a) * 92.0 * scale_factor, sin(a) * 56.0 * scale_factor))
	var body_color := Color("45c9d1")
	if mood == "dizzy": body_color = Color("6fc8ed")
	if mood == "free": body_color = Color("69e7be")
	if mood == "king": body_color = Color("ffb866")
	draw_colored_polygon(body, body_color)
	var outline := PackedVector2Array(body)
	outline.append(body[0])
	draw_polyline(outline, Color("c4fbf5"), 4.0)
	var tail := PackedVector2Array([
		center + Vector2(70.0, 0.0) * scale_factor,
		center + Vector2(138.0, -58.0) * scale_factor,
		center + Vector2(125.0, 8.0) * scale_factor,
		center + Vector2(144.0, 61.0) * scale_factor
	])
	draw_colored_polygon(tail, Color("2b9fb6"))
	draw_polyline(PackedVector2Array([tail[0], tail[1], tail[2], tail[3]]), Color("9cf0e7"), 3.0)
	# 鰭與肚皮。
	draw_colored_polygon(PackedVector2Array([
		center + Vector2(-10.0, 38.0) * scale_factor,
		center + Vector2(27.0, 78.0) * scale_factor,
		center + Vector2(50.0, 34.0) * scale_factor
	]), Color("278da8"))
	_draw_ellipse(center + Vector2(-15.0, 18.0) * scale_factor, Vector2(55.0, 25.0) * scale_factor, Color(0.78, 0.97, 0.90, 0.32))
	# 眼睛與表情。
	var eye_y := -15.0
	var eye_x := -38.0
	if mood == "dizzy":
		draw_line(center + Vector2(eye_x - 7.0, eye_y - 7.0) * scale_factor, center + Vector2(eye_x + 7.0, eye_y + 7.0) * scale_factor, CREAM, 4.0)
		draw_line(center + Vector2(eye_x + 7.0, eye_y - 7.0) * scale_factor, center + Vector2(eye_x - 7.0, eye_y + 7.0) * scale_factor, CREAM, 4.0)
	else:
		draw_circle(center + Vector2(eye_x, eye_y) * scale_factor, 12.0 * scale_factor, CREAM)
		draw_circle(center + Vector2(eye_x + 3.0, eye_y + 1.0) * scale_factor, 5.5 * scale_factor, Color("12334f"))
		if mood == "alert":
			draw_line(center + Vector2(eye_x - 14.0, eye_y - 16.0) * scale_factor, center + Vector2(eye_x + 8.0, eye_y - 23.0) * scale_factor, CREAM, 4.0)
		else:
			draw_line(center + Vector2(eye_x - 10.0, eye_y - 22.0) * scale_factor, center + Vector2(eye_x + 8.0, eye_y - 19.0) * scale_factor, CREAM, 4.0)
	var mouth_center := center + Vector2(-11.0, 15.0) * scale_factor
	if mood == "happy" or mood == "free" or mood == "king":
		draw_arc(mouth_center, 19.0 * scale_factor, 0.12, 2.55, 18, Color("163653"), 4.0)
	else:
		draw_arc(mouth_center + Vector2(0, 9) * scale_factor, 15.0 * scale_factor, 3.65, 6.0, 18, Color("163653"), 4.0)
	if mood == "king":
		var crown := PackedVector2Array([
			center + Vector2(-66, -73) * scale_factor,
			center + Vector2(-42, -108) * scale_factor,
			center + Vector2(-15, -78) * scale_factor,
			center + Vector2(12, -113) * scale_factor,
			center + Vector2(35, -73) * scale_factor
		])
		draw_colored_polygon(crown, YELLOW)
		draw_polyline(crown, Color("fff1a6"), 4.0)
	if mood == "dizzy":
		draw_arc(center + Vector2(25, -73) * scale_factor, 19.0 * scale_factor, 0.0, TAU, 20, PURPLE, 3.0)
		draw_line(center + Vector2(17, -87) * scale_factor, center + Vector2(33, -73) * scale_factor, PURPLE, 3.0)

func _draw_ellipse(center: Vector2, radii: Vector2, color: Color) -> void:
	var points := PackedVector2Array()
	for i in range(24):
		var a := TAU * float(i) / 24.0
		points.append(center + Vector2(cos(a) * radii.x, sin(a) * radii.y))
	draw_colored_polygon(points, color)

func _draw_hook(origin: Vector2, scale_factor: float) -> void:
	var metal := Color(0.82, 0.92, 0.90, 0.56)
	draw_line(origin, origin + Vector2(0, 110) * scale_factor, metal, 3.0)
	draw_arc(origin + Vector2(0, 125) * scale_factor, 25.0 * scale_factor, 0.0, PI, 18, metal, 3.0)
	draw_line(origin + Vector2(25, 125) * scale_factor, origin + Vector2(25, 155) * scale_factor, metal, 3.0)
	draw_line(origin + Vector2(25, 155) * scale_factor, origin + Vector2(13, 143) * scale_factor, metal, 3.0)
	draw_circle(origin + Vector2(0, 111) * scale_factor, 7.0 * scale_factor, CORAL)

func _build_title() -> void:
	title_layer = Control.new()
	title_layer.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(title_layer)
	title_panel = PanelContainer.new()
	title_panel.add_theme_stylebox_override("panel", _panel_style(Color(0.05, 0.16, 0.27, 0.88), CYAN, 26, 2))
	title_layer.add_child(title_panel)
	var content := VBoxContainer.new()
	content.add_theme_constant_override("separation", 8)
	content.alignment = BoxContainer.ALIGNMENT_CENTER
	title_panel.add_child(content)
	var eyebrow := _make_label("RELATIONSHIP FISHING SIMULATOR  ·  " + GAME_VERSION, 13, CYAN)
	eyebrow.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(eyebrow)
	var title := _make_label("我是魚", 74, CREAM)
	title = title
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_color_override("font_outline_color", Color(0.03, 0.10, 0.18, 0.9))
	title.add_theme_constant_override("outline_size", 8)
	content.add_child(title)
	var sub := _make_label("一款關於心動、警覺，還有不要亂咬餌的遊戲", 20, MUTED)
	sub.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	sub.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	content.add_child(sub)
	content.add_child(_spacer(18))
	var intro := _make_label("你不是獵人。\n你是那條看見訊息就會靠近的魚。", 19, CREAM)
	intro.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	intro.add_theme_constant_override("line_spacing", 5)
	content.add_child(intro)
	content.add_child(_spacer(22))
	var count_label := _make_label("本局題數", 16, YELLOW)
	count_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(count_label)
	round_select = OptionButton.new()
	round_select.custom_minimum_size = Vector2(310, 46)
	round_select.add_theme_font_size_override("font_size", 18)
	for count: int in AVAILABLE_ROUNDS:
		round_select.add_item("%d 題" % count)
	round_select.selected = AVAILABLE_ROUNDS.find(selected_round_count)
	round_select.item_selected.connect(_set_round_count)
	content.add_child(round_select)
	content.add_child(_spacer(10))
	var start_button := _make_button("開始釣自己  →", CORAL, 310)
	start_button.pressed.connect(_start_game)
	content.add_child(start_button)
	how_button = _make_button("玩法說明", CYAN, 310)
	how_button.pressed.connect(_toggle_how)
	content.add_child(how_button)
	title_hint = _make_label("", 14, YELLOW)
	title_hint.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title_hint.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	title_hint.custom_minimum_size.y = 52
	content.add_child(title_hint)
	var footer := _make_label("1 / 2 / 3 也可以直接選擇　·　Esc 返回標題　·　v" + GAME_VERSION, 12, Color(0.60, 0.80, 0.87, 0.75))
	footer.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(footer)

func _set_round_count(index: int) -> void:
	selected_round_count = AVAILABLE_ROUNDS[clampi(index, 0, AVAILABLE_ROUNDS.size() - 1)]
	title_hint.text = "本局從 200 題關係訊息中抽出 %d 題，不重複碰到同一個餌。" % selected_round_count

func _build_play() -> void:
	play_layer = Control.new()
	play_layer.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	play_layer.visible = false
	add_child(play_layer)
	var header := HBoxContainer.new()
	header.add_theme_constant_override("separation", 16)
	header.alignment = BoxContainer.ALIGNMENT_BEGIN
	play_layer.add_child(header)
	var logo := _make_label("我是魚", 26, CREAM)
	header.add_child(logo)
	round_label = _make_label("第 1 / 8 則訊息", 16, CYAN)
	round_label.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	header.add_child(round_label)
	round_progress = _make_progress(CYAN)
	round_progress.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	round_progress.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	header.add_child(round_progress)
	var escape := _make_label("Esc 離開", 13, MUTED)
	escape.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	header.add_child(escape)

	event_panel = PanelContainer.new()
	event_panel.add_theme_stylebox_override("panel", _panel_style(Color(0.06, 0.20, 0.33, 0.96), Color(0.38, 0.82, 0.85, 0.62), 24, 2))
	play_layer.add_child(event_panel)
	var event_content := VBoxContainer.new()
	event_content.add_theme_constant_override("separation", 10)
	event_panel.add_child(event_content)
	event_badge = _make_label("", 14, CORAL)
	event_badge.add_theme_stylebox_override("normal", _pill_style(Color(1.0, 0.50, 0.42, 0.16), CORAL))
	event_content.add_child(event_badge)
	event_title = _make_label("", 29, CREAM)
	event_title.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	event_content.add_child(event_title)
	event_sender = _make_label("", 14, CYAN)
	event_content.add_child(event_sender)
	var rule := ColorRect.new()
	rule.color = Color(0.44, 0.86, 0.87, 0.23)
	rule.custom_minimum_size.y = 1
	event_content.add_child(rule)
	event_message = _make_label("", 23, CREAM)
	event_message.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	event_message.custom_minimum_size.y = 132
	event_content.add_child(event_message)
	event_detail = _make_label("", 15, MUTED)
	event_detail.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	event_content.add_child(event_detail)
	event_content.add_child(_spacer(8))
	var choose_caption := _make_label("你要怎麼處理這顆餌？", 15, YELLOW)
	event_content.add_child(choose_caption)
	action_row = HBoxContainer.new()
	action_row.add_theme_constant_override("separation", 10)
	event_content.add_child(action_row)
	bite_button = _make_button("1  咬餌", CORAL, 154)
	bite_button.pressed.connect(_choose.bind(0))
	action_row.add_child(bite_button)
	observe_button = _make_button("2  先觀察", YELLOW, 154)
	observe_button.pressed.connect(_choose.bind(1))
	action_row.add_child(observe_button)
	leave_button = _make_button("3  甩尾離場", GREEN, 154)
	leave_button.pressed.connect(_choose.bind(2))
	action_row.add_child(leave_button)
	feedback_label = _make_label("", 16, GREEN)
	feedback_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	feedback_label.custom_minimum_size.y = 44
	event_content.add_child(feedback_label)
	next_button = _make_button("下一則訊息  →", CYAN, 230)
	next_button.pressed.connect(_advance_round)
	next_button.visible = false
	event_content.add_child(next_button)

	status_panel = PanelContainer.new()
	status_panel.add_theme_stylebox_override("panel", _panel_style(Color(0.04, 0.15, 0.26, 0.94), Color(0.37, 0.69, 0.81, 0.44), 24, 2))
	play_layer.add_child(status_panel)
	var status_content := VBoxContainer.new()
	status_content.add_theme_constant_override("separation", 11)
	status_panel.add_child(status_content)
	var status_title := _make_label("魚況儀表板", 20, CREAM)
	status_content.add_child(status_title)
	var status_sub := _make_label("你的心，還在自己的身上嗎？", 13, MUTED)
	status_content.add_child(status_sub)
	status_content.add_child(_spacer(8))
	var heart_row := _stat_row("心動值", "每咬一口都會變甜", CORAL)
	status_content.add_child(heart_row[0])
	heart_value = heart_row[1]
	heart_bar = heart_row[2]
	status_content.add_child(heart_bar)
	var radar_row := _stat_row("警覺值", "雷達越高，越不容易暈", CYAN)
	status_content.add_child(radar_row[0])
	radar_value = radar_row[1]
	radar_bar = radar_row[2]
	status_content.add_child(radar_bar)
	var boundary_row := _stat_row("界線值", "保留時間，也保留自己", GREEN)
	status_content.add_child(boundary_row[0])
	boundary_value = boundary_row[1]
	boundary_bar = boundary_row[2]
	status_content.add_child(boundary_bar)
	status_content.add_child(_spacer(8))
	var chain_row := _stat_row("魚餌連擊", "連續判斷漂亮就會增加", YELLOW)
	status_content.add_child(chain_row[0])
	status_content.add_child(chain_row[2])
	chain_value = chain_row[1]
	var score_row := _stat_row("本局分數", "你的感情判斷力", GREEN)
	status_content.add_child(score_row[0])
	status_content.add_child(score_row[2])
	score_value = score_row[1]
	status_content.add_child(_spacer(12))
	play_tip = _make_label("小提醒：沒有標準答案，只有更適合你的游法。", 14, PURPLE)
	play_tip.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	status_content.add_child(play_tip)

func _build_result() -> void:
	result_layer = Control.new()
	result_layer.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	result_layer.visible = false
	add_child(result_layer)
	result_panel = PanelContainer.new()
	result_panel.add_theme_stylebox_override("panel", _panel_style(Color(0.05, 0.17, 0.29, 0.97), CYAN, 28, 2))
	result_layer.add_child(result_panel)
	var content := VBoxContainer.new()
	content.alignment = BoxContainer.ALIGNMENT_CENTER
	content.add_theme_constant_override("separation", 10)
	result_panel.add_child(content)
	result_kicker = _make_label("本局魚生結算", 14, YELLOW)
	result_kicker.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(result_kicker)
	result_title = _make_label("", 40, CREAM)
	result_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	result_title.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	content.add_child(result_title)
	result_summary = _make_label("", 18, MUTED)
	result_summary.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	result_summary.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	result_summary.custom_minimum_size.y = 76
	content.add_child(result_summary)
	var divider := ColorRect.new()
	divider.color = Color(0.44, 0.86, 0.87, 0.24)
	divider.custom_minimum_size.y = 1
	content.add_child(divider)
	result_stats = _make_label("", 16, CREAM)
	result_stats.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	result_stats.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	content.add_child(result_stats)
	content.add_child(_spacer(14))
	replay_button = _make_button("再釣一次  ↻", CORAL, 280)
	replay_button.pressed.connect(_start_game)
	content.add_child(replay_button)
	title_button = _make_button("回到海面標題", CYAN, 280)
	title_button.pressed.connect(_show_title)
	content.add_child(title_button)
	var footer := _make_label("每一次甩尾，都是在把自己游回來。", 13, MUTED)
	footer.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(footer)

func _layout_ui() -> void:
	var w := size.x
	var h := size.y
	if title_panel != null:
		var title_w := minf(540.0, maxf(420.0, w * 0.46))
		var title_h := minf(560.0, maxf(480.0, h - 80.0))
		title_panel.position = Vector2(maxf(36.0, w * 0.07), maxf(32.0, (h - title_h) * 0.5))
		title_panel.size = Vector2(title_w, title_h)
	if play_layer != null:
		var margin := 46.0
		var header := play_layer.get_child(0) as HBoxContainer
		header.position = Vector2(margin, 24.0)
		header.size = Vector2(maxf(500.0, w - margin * 2.0), 54.0)
		var body_top := 110.0
		var body_h := maxf(450.0, h - body_top - 54.0)
		var body_w := minf(1200.0, w - margin * 2.0)
		var left_w := body_w * 0.66
		var gap := 22.0
		event_panel.position = Vector2(maxf(margin, (w - body_w) * 0.5), body_top)
		event_panel.size = Vector2(left_w - gap, body_h)
		status_panel.position = Vector2(event_panel.position.x + left_w, body_top + 12.0)
		status_panel.size = Vector2(body_w - left_w, body_h - 24.0)
	if result_panel != null:
		var result_w := minf(620.0, w - 80.0)
		var result_h := minf(560.0, h - 60.0)
		result_panel.position = Vector2((w - result_w) * 0.5, (h - result_h) * 0.5)
		result_panel.size = Vector2(result_w, result_h)

func _show_title() -> void:
	screen = "title"
	title_layer.visible = true
	play_layer.visible = false
	result_layer.visible = false
	showing_how = false
	if round_select != null:
		round_select.selected = AVAILABLE_ROUNDS.find(selected_round_count)
	title_hint.text = "本局從 200 題關係訊息中抽出 %d 題，不重複碰到同一個餌。" % selected_round_count
	how_button.text = "玩法說明"
	queue_redraw()

func _toggle_how() -> void:
	showing_how = not showing_how
	if showing_how:
		title_hint.text = "每回合閱讀一則關係誘餌，選擇：\n1 咬餌　2 先觀察　3 甩尾離場。心動不等於真心，警覺也不是冷漠。"
		how_button.text = "收起說明"
	else:
		title_hint.text = "按開始，看看你今天會不會又被一句「在嗎」釣走。"
		how_button.text = "玩法說明"

func _start_game() -> void:
	screen = "play"
	title_layer.visible = false
	play_layer.visible = true
	result_layer.visible = false
	round_count = selected_round_count
	round_index = 0
	heart = 42
	radar = 28
	boundary = 50
	chain = 0
	score = 0
	ending_key = ""
	round_deck = events.duplicate()
	round_deck.shuffle()
	_next_event()
	queue_redraw()

func _next_event() -> void:
	if round_index >= round_count:
		_finish_game()
		return
	current_event = round_deck[round_index] if not round_deck.is_empty() else events[round_index]
	selected_choice = -1
	answer_locked = false
	event_badge.text = current_event["icon"] + "  " + current_event["type"]
	event_badge.add_theme_color_override("font_color", current_event["bait_color"])
	event_title.text = current_event["title"]
	event_sender.text = current_event["sender"] + "  ·  關係海域傳來一則訊息"
	event_message.text = current_event["message"]
	event_detail.text = current_event["detail"]
	feedback_label.text = ""
	next_button.visible = false
	bite_button.disabled = false
	observe_button.disabled = false
	leave_button.disabled = false
	round_label.text = "第 %d / %d 則訊息" % [round_index + 1, round_count]
	round_progress.value = float(round_index) / float(round_count) * 100.0
	_update_status()

func _choose(choice: int) -> void:
	if answer_locked:
		return
	answer_locked = true
	selected_choice = choice
	bite_button.disabled = true
	observe_button.disabled = true
	leave_button.disabled = true
	var best: int = current_event["best"]
	var was_best := choice == best
	if choice == 0:
		heart += 13
		radar -= 8
		boundary -= 7
		score += 70 + chain * 12
		chain += 1
		feedback_label.text = "咬下去了！心動 +13，警覺 -8，界線 -7。\n%s" % _choice_comment(choice, was_best)
		feedback_label.add_theme_color_override("font_color", CORAL)
	elif choice == 1:
		heart += 4
		radar += 8
		boundary += 8
		score += 105 + (20 if was_best else 0)
		chain = chain + 1 if was_best else 0
		feedback_label.text = "你把餌翻過來看了一圈。心動 +4，警覺 +8，界線 +8。\n%s" % _choice_comment(choice, was_best)
		feedback_label.add_theme_color_override("font_color", YELLOW)
	else:
		heart -= 4
		radar += 14
		boundary += 12
		score += 90 + (25 if was_best else 0)
		chain = chain + 1 if was_best else 0
		feedback_label.text = "甩尾成功！心動 -4，警覺 +14，界線 +12。\n%s" % _choice_comment(choice, was_best)
		feedback_label.add_theme_color_override("font_color", GREEN)
	heart = clampi(heart, 0, 100)
	radar = clampi(radar, 0, 100)
	boundary = clampi(boundary, 0, 100)
	feedback_label.visible = true
	next_button.visible = true
	next_button.grab_focus()
	_update_status()
	queue_redraw()

func _advance_round() -> void:
	if not answer_locked:
		return
	round_index += 1
	_next_event()
	queue_redraw()

func _finish_game() -> void:
	screen = "result"
	play_layer.visible = false
	result_layer.visible = true
	if score > best_score:
		best_score = score
	if score >= 820 and heart >= 70:
		ending_key = "happy"
		result_title.text = "幸福上岸 🏝️"
		result_summary.text = "你沒有失去心動，也沒有弄丟自己。\n這不是被釣上岸，是你決定跟值得的人一起靠岸。"
	elif radar >= 78 and heart < 52:
		ending_key = "free"
		result_title.text = "成功脫鉤 🐟"
		result_summary.text = "你把魚鉤還給了海，順便把自己的時間也拿了回來。\n今天沒有上鉤，明天也不用急著上。"
	elif heart >= 86 and radar < 32:
		ending_key = "dizzy"
		result_title.text = "被群發捕獲 🕸️"
		result_summary.text = "你以為是命中注定，結果只是對方的群發名單很長。\n先休息一下，暈船不是你的錯，但下船要靠你。"
	elif chain >= 4:
		ending_key = "king"
		result_title.text = "海王／海后養成 👑"
		result_summary.text = "你看穿了餌，也學會了不把每一次心動都當成承諾。\n恭喜解鎖：在海裡游得漂亮的人。"
	elif heart >= 58:
		ending_key = "dizzy"
		result_title.text = "差點暈船 🌀"
		result_summary.text = "心動是真的，警覺也是真的。\n你還沒有翻船，只是需要一杯溫開水和一點距離。"
	else:
		ending_key = "free"
		result_title.text = "自由潛水員 🌊"
		result_summary.text = "你沒有急著成為誰的特別，也沒有把孤單誤認成愛。\n海很大，慢慢游就好。"
	result_stats.text = "心動值  %d / 100    ·    警覺值  %d / 100    ·    界線值  %d / 100\n本局分數  %d    ·    魚餌連擊  %d    ·    最高分  %d\n\n游法報告：%s" % [heart, radar, boundary, score, chain, best_score, _boundary_report()]
	queue_redraw()

func _update_status() -> void:
	heart_value.text = "%d / 100" % heart
	radar_value.text = "%d / 100" % radar
	boundary_value.text = "%d / 100" % boundary
	chain_value.text = "%d 次漂亮判斷" % chain
	score_value.text = "%d" % score
	heart_bar.value = heart
	radar_bar.value = radar
	boundary_bar.value = boundary

func _choice_comment(choice: int, was_best: bool) -> String:
	if choice == 0:
		return "甜甜的餌，通常也會附贈一點點暈船。" if not was_best else "這次的心動有根據，但還是記得看後續行動。"
	if choice == 1:
		return "漂亮，先讓時間替你驗證。" if was_best else "不急著回，也是一種回覆。"
	return "這個轉身，游得很有尊嚴。" if was_best else "你選擇先把自己放回第一順位。"

func _boundary_report() -> String:
	if boundary >= 78 and radar >= 65:
		return "自由海域型：你能靠近，也能清楚地保留自己的時間與界線。"
	if boundary >= 68:
		return "深海觀察型：你願意感受心動，但不急著把訊息當成承諾。"
	if heart >= 78 and boundary < 42:
		return "容易暈船型：感受力很強；下一趟游泳，記得替自己留一個出口。"
	if boundary < 55:
		return "浪漫冒險型：你很勇敢地靠近，也可以練習在靠近前先問問自己。"
	return "平衡游法型：你正在找到心動與自我保護之間舒服的距離。"

func _stat_row(caption: String, description: String, accent: Color) -> Array:
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 8)
	var title := _make_label(caption, 16, accent)
	title.custom_minimum_size.x = 94
	row.add_child(title)
	var value := _make_label("0", 16, CREAM)
	value.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	value.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	row.add_child(value)
	return [row, value, _make_progress(accent), description]

func _make_progress(accent: Color) -> ProgressBar:
	var bar := ProgressBar.new()
	bar.min_value = 0
	bar.max_value = 100
	bar.value = 0
	bar.show_percentage = false
	bar.custom_minimum_size.y = 10
	bar.add_theme_stylebox_override("background", _panel_style(Color(0.02, 0.08, 0.14, 0.9), Color(1, 1, 1, 0.08), 8, 1))
	bar.add_theme_stylebox_override("fill", _panel_style(accent, accent, 8, 0))
	return bar

func _make_label(text: String, font_size: int, color: Color) -> Label:
	var label := Label.new()
	label.text = text
	label.add_theme_font_size_override("font_size", font_size)
	label.add_theme_color_override("font_color", color)
	label.add_theme_color_override("font_outline_color", Color(0.01, 0.04, 0.08, 0.55))
	label.add_theme_constant_override("outline_size", 2)
	return label

func _make_button(text: String, accent: Color, width: float) -> Button:
	var button := Button.new()
	button.text = text
	button.custom_minimum_size = Vector2(width, 52.0)
	button.add_theme_font_size_override("font_size", 17)
	button.add_theme_color_override("font_color", CREAM)
	button.add_theme_color_override("font_hover_color", Color.WHITE)
	button.add_theme_color_override("font_pressed_color", CREAM)
	button.add_theme_color_override("font_focus_color", CREAM)
	button.add_theme_stylebox_override("normal", _panel_style(Color(0.07, 0.21, 0.33, 0.95), Color(accent, 0.58), 15, 2))
	button.add_theme_stylebox_override("hover", _panel_style(Color(accent, 0.24), accent, 15, 2))
	button.add_theme_stylebox_override("pressed", _panel_style(Color(accent, 0.40), accent, 15, 2))
	button.add_theme_stylebox_override("focus", _panel_style(Color(0.10, 0.28, 0.40, 0.98), accent, 15, 3))
	button.add_theme_stylebox_override("disabled", _panel_style(Color(0.05, 0.12, 0.19, 0.65), Color(0.45, 0.58, 0.63, 0.25), 15, 1))
	return button

func _panel_style(bg: Color, border: Color, radius: int, width: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = bg
	style.border_color = border
	style.set_border_width_all(width)
	style.set_corner_radius_all(radius)
	style.content_margin_left = 22.0
	style.content_margin_right = 22.0
	style.content_margin_top = 18.0
	style.content_margin_bottom = 18.0
	style.shadow_color = Color(0.0, 0.03, 0.07, 0.35)
	style.shadow_size = 12
	return style

func _pill_style(bg: Color, border: Color) -> StyleBoxFlat:
	var style := _panel_style(bg, border, 12, 1)
	style.content_margin_left = 12.0
	style.content_margin_right = 12.0
	style.content_margin_top = 6.0
	style.content_margin_bottom = 6.0
	return style

func _spacer(height: float) -> Control:
	var spacer := Control.new()
	spacer.custom_minimum_size.y = height
	return spacer

func _play_mood() -> String:
	if radar >= 70:
		return "alert"
	if heart >= 78:
		return "dizzy"
	if chain >= 3:
		return "king"
	return "thinking"
