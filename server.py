import http.server
import socketserver
import os

PORT = 8080
DIRECTORY = "."  

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"🚀 Сервер запущен на http://localhost:{PORT}")
    print(f"📁 Отдаю файлы из: {os.path.abspath(DIRECTORY)}")
    print("📱 Для тестирования Mini App используйте команду /app в боте")
    print("🛑 Для остановки нажмите Ctrl+C")
    httpd.serve_forever()