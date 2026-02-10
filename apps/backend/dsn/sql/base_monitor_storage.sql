DROP TABLE IF EXISTS base_monitor_storage;

-- 创建新的表，包含 event_type 和 message 字段
CREATE TABLE
    base_monitor_storage (
        app_id String, -- 应用 ID，存储为字符串
        info String, -- 信息类型，存储为字符串
        created_at DateTime DEFAULT now (), -- 创建时间，默认为当前时间
        event_type String, -- 事件类型，存储为字符串
        message String -- 消息内容，存储为 JSON 格式
    ) ENGINE = MergeTree ()
ORDER BY
    tuple ();

-- 创建物化视图
-- 删除已有的物化视图（如果存在）
DROP TABLE IF EXISTS base_monitor_view;

-- 创建物化视图
CREATE MATERIALIZED VIEW base_monitor_view ENGINE = MergeTree ()
ORDER BY
    tuple () -- 定义排序规则
    POPULATE -- 立即填充数据
    AS
SELECT
    app_id,
    info,
    created_at,
    event_type,
    message,
    -- 在此可以对 raw_message 进行任何所需的处理或选择部分字段
    concat ('tianniu', event_type) AS processed_message
FROM
    base_monitor_storage;