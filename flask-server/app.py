# flask-server/app.py
from flask import Flask
from config import DATA_DIR
# from views.compare_view import compare_bp
from views.compare import compare_bp
from flask import send_from_directory


app = Flask(__name__, static_folder='static')
app.config['DATA_DIR'] = DATA_DIR

app.register_blueprint(compare_bp)

@app.route('/data/<path:filename>')
def serve_data(filename):
    return send_from_directory(app.config['DATA_DIR'], filename)

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
