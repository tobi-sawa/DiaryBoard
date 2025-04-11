FROM python:3.9

RUN mkdir -p /var/www && chown -R root:root /var/www

WORKDIR /var/www

COPY requirements.txt ./

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY .  .

CMD ["uvicorn","main:app","--host","0.0.0.0","--port","8000"]