from telegram 
import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo

async def app_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Открывает Mini App"""
    user_id = update.message.chat.id
    
    web_app_url = "https://ваш-сайт.com/index.html"  # ПОКА НЕ ТРОГАЙТЕ
    
    test_url = "http://localhost:8080/index.html"
    
    keyboard = [[
        InlineKeyboardButton(
            "✨ Открыть Mental Manager", 
            web_app=WebAppInfo(url=test_url)  # Используем локальный URL для теста
        )
    ]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "🚀 *Открыть расширенный интерфейс*\n\n"
        "В Mini App доступно:\n"
        "• 📊 Создание психологического профиля\n"
        "• 💬 Удобный чат\n"
        "• 🎯 Визуализация прогресса\n\n"
        "Нажмите кнопку ниже:",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

async def web_app_data_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обрабатывает данные из Mini App"""
    user_id = update.message.chat.id
    data = json.loads(update.message.web_app_data.data)
    
    if data.get('type') == 'psychological_profile':
        profile = data['data']
        
        if user_id not in user_profiles:
            user_profiles[user_id] = create_user_profile(user_id)
        
        user_profiles[user_id]['basic_info'] = {
            "age": profile['basic']['age'],
            "occupation": profile['basic']['occupation']
        }
        
        user_profiles[user_id]['psychological_profile'].update({
            "main_issues": profile['topics'],
            "strengths": profile['strengths'],
            "emotional_patterns": [f"Тревога: {profile['emotionalState']['anxiety']}/10"],
            "preferred_response_style": "analytical"
        })
        
        user_profiles[user_id]['assessment_complete'] = True
        user_profiles[user_id]['last_assessment'] = datetime.now().isoformat()
        
        await update.message.reply_text(
            f"✅ *Психологический профиль создан!*\n\n"
            f"📊 **Основные данные:**\n"
            f"• Возраст: {profile['basic']['age']}\n"
            f"• Деятельность: {profile['basic']['occupation']}\n"
            f"• Темы: {', '.join(profile['topics'][:3])}\n"
            f"• Сильные стороны: {', '.join(profile['strengths'][:3])}\n\n"
            f"Теперь я могу оказывать более персонализированную помощь!",
            parse_mode='Markdown'
        )
def main():
    """Основная функция запуска"""
    application = Application.builder().token(TOKEN).build()
    
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("mood", mood_tracking_command))
    application.add_handler(CommandHandler("techniques", technique_library_command))
    application.add_handler(CommandHandler("progress", progress_command))
    application.add_handler(CommandHandler("help", quick_help_command))
    application.add_handler(CommandHandler("assessment", start_assessment_conversation))
    application.add_handler(CommandHandler("app", app_command))  # ← НОВАЯ КОМАНДА
    
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data_handler))
    
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    print("=" * 60)
    print("🤵‍♂️ MENTAL MANAGER 3.0 ЗАПУЩЕН!")
    print("🚀 Mini App доступен по команде /app")
    print("🎯 Психологический профиль в разработке")
    print("=" * 60)
    
    application.run_polling()