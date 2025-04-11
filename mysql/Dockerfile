FROM mysql:8.0

# MySQL 設定ファイルをコピー
COPY my.cnf /etc/mysql/my.cnf
COPY my.cnf /etc/mysql/conf.d/my.cnf

# 日本語ロケールとタイムゾーンをインストール
RUN microdnf install -y glibc-langpack-ja tzdata && \
    echo 'LANG=ja_JP.utf8' > /etc/locale.conf && \
    echo 'LC_ALL=ja_JP.utf8' >> /etc/locale.conf && \
    ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# 環境変数の設定
ENV LANG=ja_JP.UTF-8
ENV LC_ALL=ja_JP.UTF-8
ENV TZ=Asia/Tokyo

CMD ["mysqld"]

EXPOSE 3306
