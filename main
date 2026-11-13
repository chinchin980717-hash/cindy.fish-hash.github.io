extends Control

const GAME_VERSION := "2.8.0"
const AVAILABLE_ROUNDS: Array[int] = [5, 8, 10, 15, 30, 60, 100, 250]
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
var action_counts := {"bite": 0, "observe": 0, "unhook": 0}
var current_event: Dictionary = {}
var current_answers: Array = []
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
var action_row: VBoxContainer
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

var events: Array = []

var round_deck: Array = []

func _build_event_bank() -> void:
	events.clear()
	var file := FileAccess.open("res://questions.json", FileAccess.READ)
	if file == null:
		push_error("找不到 res://questions.json")
		return
	var parsed: Variant = JSON.parse_string(file.get_as_text())
	if not parsed is Dictionary or not parsed.has("questions"):
		push_error("questions.json 格式錯誤")
		return
	events = parsed["questions"]

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
		round_select.add_item("%d 題%s" % [count, "｜完整題庫" if count == 250 else ""])
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
	event_content.add_theme_constant_override("separation", 6)
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
	event_message = _make_label("", 20, CREAM)
	event_message.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	event_message.custom_minimum_size.y = 108
	event_content.add_child(event_message)
	event_detail = _make_label("", 15, MUTED)
	event_detail.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	event_content.add_child(_spacer(8))
	var choose_caption := _make_label("你會傳出哪一段回覆？", 15, YELLOW)
	event_content.add_child(choose_caption)
	action_row = VBoxContainer.new()
	action_row.add_theme_constant_override("separation", 8)
	event_content.add_child(action_row)
	bite_button = _make_button("", CYAN, 154)
	bite_button.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	bite_button.custom_minimum_size.y = 64
	bite_button.add_theme_font_size_override("font_size", 14)
	bite_button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	bite_button.pressed.connect(_choose.bind(0))
	action_row.add_child(bite_button)
	observe_button = _make_button("", CYAN, 154)
	observe_button.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	observe_button.custom_minimum_size.y = 64
	observe_button.add_theme_font_size_override("font_size", 14)
	observe_button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	observe_button.pressed.connect(_choose.bind(1))
	action_row.add_child(observe_button)
	leave_button = _make_button("", CYAN, 154)
	leave_button.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	leave_button.custom_minimum_size.y = 64
	leave_button.add_theme_font_size_override("font_size", 14)
	leave_button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
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
		var body_top := 92.0
		var body_h := maxf(450.0, h - body_top - 42.0)
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
	title_hint.text = "共 250 題關係情境；可選短局隨機抽題，或依序完成 250 題完整航程。"
	how_button.text = "玩法說明"
	queue_redraw()

func _toggle_how() -> void:
	showing_how = not showing_how
	if showing_how:
		title_hint.text = "每回合閱讀情境，先選你會送出的文字回覆。選完才會揭曉魚的動作與數值變化；咬餌、觀察、脫鉤都是結果，不是選項。"
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
	action_counts = {"bite": 0, "observe": 0, "unhook": 0}
	ending_key = ""
	if selected_round_count == events.size():
		round_deck = events.duplicate()
	else:
		round_deck = events.duplicate()
		round_deck.shuffle()
		round_deck.resize(mini(selected_round_count, round_deck.size()))
	_next_event()
	queue_redraw()

func _next_event() -> void:
	if round_index >= round_count:
		_finish_game()
		return
	current_event = round_deck[round_index]
	selected_choice = -1
	answer_locked = false
	event_badge.text = "🐟  關係海域來訊"
	event_badge.add_theme_color_override("font_color", CYAN)
	event_title.text = current_event["title"]
	event_sender.text = "第 %s 題" % str(current_event["id"])
	event_message.text = current_event["scenario"]
	event_detail.text = "讀完情境，選一段你會送出的回覆；魚的反應稍後揭曉。"
	current_answers = current_event["answers"].duplicate()
	current_answers.shuffle()
	bite_button.text = "1. " + str(current_answers[0]["text"])
	observe_button.text = "2. " + str(current_answers[1]["text"])
	leave_button.text = "3. " + str(current_answers[2]["text"])
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
	var answer: Dictionary = current_answers[choice]
	var fish_action: String = answer["fishAction"]
	action_counts[fish_action] += 1
	if fish_action == "bite":
		heart += 13
		radar -= 8
		boundary -= 7
		score += 70 + chain * 12
		chain += 1
		feedback_label.text = "魚的動作：咬餌。心動 +13，警覺 -8，界線 -7。\n%s" % _choice_comment(fish_action)
		feedback_label.add_theme_color_override("font_color", CORAL)
	elif fish_action == "observe":
		heart += 4
		radar += 8
		boundary += 8
		score += 105
		chain = 0
		feedback_label.text = "魚的動作：先觀察。心動 +4，警覺 +8，界線 +8。\n%s" % _choice_comment(fish_action)
		feedback_label.add_theme_color_override("font_color", YELLOW)
	else:
		heart -= 4
		radar += 14
		boundary += 12
		score += 90
		chain = 0
		feedback_label.text = "魚的動作：脫鉤（甩尾離場）。心動 -4，警覺 +14，界線 +12。\n%s" % _choice_comment(fish_action)
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

func _choice_comment(fish_action: String) -> String:
	if fish_action == "bite":
		return "心動沒有對錯；也記得觀察後續行動。"
	if fish_action == "observe":
		return "先讓時間替你驗證，不急著下結論。"
	return "離開不代表冷漠，也可以是在照顧自己。"

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
