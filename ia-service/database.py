from sqlalchemy import create_engine

DATABASE_URL = "mysql+pymysql://root:12345@localhost:3306/condominio_horizonte"

engine = create_engine(DATABASE_URL)