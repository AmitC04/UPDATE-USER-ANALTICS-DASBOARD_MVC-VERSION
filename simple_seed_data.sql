-- Clear existing data first
DELETE FROM user_audit_log;
DELETE FROM user_sessions;
DELETE FROM user_activity;
DELETE FROM users;

-- Insert sample users (254 users to match registration count)
INSERT INTO users (user_id, first_name, last_name, email, auth_provider, password_changed_at) VALUES
(1, 'John', 'Doe', 'john.doe@example.com', 'EMAIL', NULL),
(2, 'Jane', 'Smith', 'jane.smith@example.com', 'GOOGLE', NULL),
(3, 'Bob', 'Johnson', 'bob.johnson@example.com', 'EMAIL', NULL),
(4, 'Alice', 'Williams', 'alice.williams@example.com', 'EMAIL', NULL),
(5, 'Charlie', 'Brown', 'charlie.brown@example.com', 'GOOGLE', NULL),
(6, 'Diana', 'Miller', 'diana.miller@example.com', 'EMAIL', NULL),
(7, 'Edward', 'Davis', 'edward.davis@example.com', 'EMAIL', NULL),
(8, 'Fiona', 'Garcia', 'fiona.garcia@example.com', 'GOOGLE', NULL),
(9, 'George', 'Rodriguez', 'george.rodriguez@example.com', 'EMAIL', NULL),
(10, 'Helen', 'Martinez', 'helen.martinez@example.com', 'EMAIL', NULL),
(11, 'Ian', 'Wilson', 'ian.wilson@example.com', 'GOOGLE', NULL),
(12, 'Julia', 'Moore', 'julia.moore@example.com', 'EMAIL', NULL),
(13, 'Kevin', 'Taylor', 'kevin.taylor@example.com', 'EMAIL', NULL),
(14, 'Laura', 'Anderson', 'laura.anderson@example.com', 'GOOGLE', NULL),
(15, 'Michael', 'Thomas', 'michael.thomas@example.com', 'EMAIL', NULL),
(16, 'Nina', 'Jackson', 'nina.jackson@example.com', 'EMAIL', NULL),
(17, 'Oscar', 'White', 'oscar.white@example.com', 'GOOGLE', NULL),
(18, 'Paula', 'Harris', 'paula.harris@example.com', 'EMAIL', NULL),
(19, 'Quincy', 'Clark', 'quincy.clark@example.com', 'EMAIL', NULL),
(20, 'Rachel', 'Lewis', 'rachel.lewis@example.com', 'GOOGLE', NULL),
(21, 'Steve', 'Robinson', 'steve.robinson@example.com', 'EMAIL', NULL),
(22, 'Tina', 'Walker', 'tina.walker@example.com', 'EMAIL', NULL),
(23, 'Umar', 'Hall', 'umar.hall@example.com', 'GOOGLE', NULL),
(24, 'Vanessa', 'Allen', 'vanessa.allen@example.com', 'EMAIL', NULL),
(25, 'William', 'Young', 'william.young@example.com', 'EMAIL', NULL);

-- Insert additional users up to 254 to match registration count
INSERT INTO users (user_id, first_name, last_name, email, auth_provider, password_changed_at)
SELECT 
    u.user_id,
    CONCAT('User', u.user_id) AS first_name,
    CONCAT('LastName', u.user_id) AS last_name,
    CONCAT('user', u.user_id, '@example.com') AS email,
    CASE WHEN u.user_id % 2 = 0 THEN 'GOOGLE' ELSE 'EMAIL' END AS auth_provider,
    NULL AS password_changed_at
FROM (
    SELECT 26 AS user_id UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30
    UNION ALL SELECT 31 UNION ALL SELECT 32 UNION ALL SELECT 33 UNION ALL SELECT 34 UNION ALL SELECT 35
    UNION ALL SELECT 36 UNION ALL SELECT 37 UNION ALL SELECT 38 UNION ALL SELECT 39 UNION ALL SELECT 40
    UNION ALL SELECT 41 UNION ALL SELECT 42 UNION ALL SELECT 43 UNION ALL SELECT 44 UNION ALL SELECT 45
    UNION ALL SELECT 46 UNION ALL SELECT 47 UNION ALL SELECT 48 UNION ALL SELECT 49 UNION ALL SELECT 50
    UNION ALL SELECT 51 UNION ALL SELECT 52 UNION ALL SELECT 53 UNION ALL SELECT 54 UNION ALL SELECT 55
    UNION ALL SELECT 56 UNION ALL SELECT 57 UNION ALL SELECT 58 UNION ALL SELECT 59 UNION ALL SELECT 60
    UNION ALL SELECT 61 UNION ALL SELECT 62 UNION ALL SELECT 63 UNION ALL SELECT 64 UNION ALL SELECT 65
    UNION ALL SELECT 66 UNION ALL SELECT 67 UNION ALL SELECT 68 UNION ALL SELECT 69 UNION ALL SELECT 70
    UNION ALL SELECT 71 UNION ALL SELECT 72 UNION ALL SELECT 73 UNION ALL SELECT 74 UNION ALL SELECT 75
    UNION ALL SELECT 76 UNION ALL SELECT 77 UNION ALL SELECT 78 UNION ALL SELECT 79 UNION ALL SELECT 80
    UNION ALL SELECT 81 UNION ALL SELECT 82 UNION ALL SELECT 83 UNION ALL SELECT 84 UNION ALL SELECT 85
    UNION ALL SELECT 86 UNION ALL SELECT 87 UNION ALL SELECT 88 UNION ALL SELECT 89 UNION ALL SELECT 90
    UNION ALL SELECT 91 UNION ALL SELECT 92 UNION ALL SELECT 93 UNION ALL SELECT 94 UNION ALL SELECT 95
    UNION ALL SELECT 96 UNION ALL SELECT 97 UNION ALL SELECT 98 UNION ALL SELECT 99 UNION ALL SELECT 100
    UNION ALL SELECT 101 UNION ALL SELECT 102 UNION ALL SELECT 103 UNION ALL SELECT 104 UNION ALL SELECT 105
    UNION ALL SELECT 106 UNION ALL SELECT 107 UNION ALL SELECT 108 UNION ALL SELECT 109 UNION ALL SELECT 110
    UNION ALL SELECT 111 UNION ALL SELECT 112 UNION ALL SELECT 113 UNION ALL SELECT 114 UNION ALL SELECT 115
    UNION ALL SELECT 116 UNION ALL SELECT 117 UNION ALL SELECT 118 UNION ALL SELECT 119 UNION ALL SELECT 120
    UNION ALL SELECT 121 UNION ALL SELECT 122 UNION ALL SELECT 123 UNION ALL SELECT 124 UNION ALL SELECT 125
    UNION ALL SELECT 126 UNION ALL SELECT 127 UNION ALL SELECT 128 UNION ALL SELECT 129 UNION ALL SELECT 130
    UNION ALL SELECT 131 UNION ALL SELECT 132 UNION ALL SELECT 133 UNION ALL SELECT 134 UNION ALL SELECT 135
    UNION ALL SELECT 136 UNION ALL SELECT 137 UNION ALL SELECT 138 UNION ALL SELECT 139 UNION ALL SELECT 140
    UNION ALL SELECT 141 UNION ALL SELECT 142 UNION ALL SELECT 143 UNION ALL SELECT 144 UNION ALL SELECT 145
    UNION ALL SELECT 146 UNION ALL SELECT 147 UNION ALL SELECT 148 UNION ALL SELECT 149 UNION ALL SELECT 150
    UNION ALL SELECT 151 UNION ALL SELECT 152 UNION ALL SELECT 153 UNION ALL SELECT 154 UNION ALL SELECT 155
    UNION ALL SELECT 156 UNION ALL SELECT 157 UNION ALL SELECT 158 UNION ALL SELECT 159 UNION ALL SELECT 160
    UNION ALL SELECT 161 UNION ALL SELECT 162 UNION ALL SELECT 163 UNION ALL SELECT 164 UNION ALL SELECT 165
    UNION ALL SELECT 166 UNION ALL SELECT 167 UNION ALL SELECT 168 UNION ALL SELECT 169 UNION ALL SELECT 170
    UNION ALL SELECT 171 UNION ALL SELECT 172 UNION ALL SELECT 173 UNION ALL SELECT 174 UNION ALL SELECT 175
    UNION ALL SELECT 176 UNION ALL SELECT 177 UNION ALL SELECT 178 UNION ALL SELECT 179 UNION ALL SELECT 180
    UNION ALL SELECT 181 UNION ALL SELECT 182 UNION ALL SELECT 183 UNION ALL SELECT 184 UNION ALL SELECT 185
    UNION ALL SELECT 186 UNION ALL SELECT 187 UNION ALL SELECT 188 UNION ALL SELECT 189 UNION ALL SELECT 190
    UNION ALL SELECT 191 UNION ALL SELECT 192 UNION ALL SELECT 193 UNION ALL SELECT 194 UNION ALL SELECT 195
    UNION ALL SELECT 196 UNION ALL SELECT 197 UNION ALL SELECT 198 UNION ALL SELECT 199 UNION ALL SELECT 200
    UNION ALL SELECT 201 UNION ALL SELECT 202 UNION ALL SELECT 203 UNION ALL SELECT 204 UNION ALL SELECT 205
    UNION ALL SELECT 206 UNION ALL SELECT 207 UNION ALL SELECT 208 UNION ALL SELECT 209 UNION ALL SELECT 210
    UNION ALL SELECT 211 UNION ALL SELECT 212 UNION ALL SELECT 213 UNION ALL SELECT 214 UNION ALL SELECT 215
    UNION ALL SELECT 216 UNION ALL SELECT 217 UNION ALL SELECT 218 UNION ALL SELECT 219 UNION ALL SELECT 220
    UNION ALL SELECT 221 UNION ALL SELECT 222 UNION ALL SELECT 223 UNION ALL SELECT 224 UNION ALL SELECT 225
    UNION ALL SELECT 226 UNION ALL SELECT 227 UNION ALL SELECT 228 UNION ALL SELECT 229 UNION ALL SELECT 230
    UNION ALL SELECT 231 UNION ALL SELECT 232 UNION ALL SELECT 233 UNION ALL SELECT 234 UNION ALL SELECT 235
    UNION ALL SELECT 236 UNION ALL SELECT 237 UNION ALL SELECT 238 UNION ALL SELECT 239 UNION ALL SELECT 240
    UNION ALL SELECT 241 UNION ALL SELECT 242 UNION ALL SELECT 243 UNION ALL SELECT 244 UNION ALL SELECT 245
    UNION ALL SELECT 246 UNION ALL SELECT 247 UNION ALL SELECT 248 UNION ALL SELECT 249 UNION ALL SELECT 250
    UNION ALL SELECT 251 UNION ALL SELECT 252 UNION ALL SELECT 253 UNION ALL SELECT 254
) u;

-- Insert registrations (254 total, with many from today)
INSERT INTO user_activity (user_id, session_id, is_guest, event_type, page_url, referrer_url, device_type, browser_name, ip_address, geo_country, geo_city, order_id, amount, currency, event_time, metadata, created_at) VALUES
(1, 'sess_001', 0, 'register_email', '/auth/register', 'https://google.com', 'desktop', 'Chrome', '192.168.1.101', 'USA', 'New York', NULL, NULL, 'USD', NOW(), JSON_OBJECT('source', 'google_ad'), NOW()),
(2, 'sess_002', 0, 'register_google', '/auth/register', 'https://facebook.com', 'mobile', 'Safari', '192.168.1.102', 'USA', 'Los Angeles', NULL, NULL, 'USD', NOW(), JSON_OBJECT('source', 'facebook_ad'), NOW()),
(3, 'sess_003', 0, 'register_email', '/auth/register', 'https://direct', 'desktop', 'Firefox', '192.168.1.103', 'USA', 'Chicago', NULL, NULL, 'USD', NOW(), JSON_OBJECT('source', 'organic'), NOW()),
(4, 'sess_004', 0, 'register_email', '/auth/register', 'https://twitter.com', 'tablet', 'Chrome', '192.168.1.104', 'USA', 'Houston', NULL, NULL, 'USD', NOW(), JSON_OBJECT('source', 'twitter_ad'), NOW()),
(5, 'sess_005', 0, 'register_google', '/auth/register', 'https://youtube.com', 'mobile', 'Chrome', '192.168.1.105', 'USA', 'Phoenix', NULL, NULL, 'USD', NOW(), JSON_OBJECT('source', 'youtube_ad'), NOW());

-- More registrations to reach 254 total
INSERT INTO user_activity (user_id, session_id, is_guest, event_type, page_url, referrer_url, device_type, browser_name, ip_address, geo_country, geo_city, order_id, amount, currency, event_time, metadata, created_at)
SELECT 
    u.user_id,
    CONCAT('sess_', LPAD(u.user_id + 30, 3, '0')) AS session_id,
    0 AS is_guest,
    CASE WHEN u.user_id % 2 = 0 THEN 'register_email' ELSE 'register_google' END AS event_type,
    '/auth/register' AS page_url,
    CASE 
        WHEN u.user_id % 3 = 0 THEN 'https://google.com'
        WHEN u.user_id % 3 = 1 THEN 'https://facebook.com'
        ELSE 'https://direct'
    END AS referrer_url,
    CASE 
        WHEN u.user_id % 3 = 0 THEN 'desktop'
        WHEN u.user_id % 3 = 1 THEN 'mobile'
        ELSE 'tablet'
    END AS device_type,
    CASE 
        WHEN u.user_id % 3 = 0 THEN 'Chrome'
        WHEN u.user_id % 3 = 1 THEN 'Safari'
        ELSE 'Firefox'
    END AS browser_name,
    CONCAT('192.168.1.', 130 + u.user_id) AS ip_address,
    'USA' AS geo_country,
    CASE 
        WHEN u.user_id % 5 = 0 THEN 'New York'
        WHEN u.user_id % 5 = 1 THEN 'Los Angeles'
        WHEN u.user_id % 5 = 2 THEN 'Chicago'
        WHEN u.user_id % 5 = 3 THEN 'Houston'
        ELSE 'Phoenix'
    END AS geo_city,
    NULL AS order_id,
    NULL AS amount,
    'USD' AS currency,
    NOW() AS event_time,
    JSON_OBJECT('source', 
        CASE 
            WHEN u.user_id % 4 = 0 THEN 'google_ad'
            WHEN u.user_id % 4 = 1 THEN 'facebook_ad'
            WHEN u.user_id % 4 = 2 THEN 'twitter_ad'
            ELSE 'organic'
        END
    ) AS metadata,
    NOW() AS created_at
FROM (
    SELECT 26 AS user_id UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30
    UNION ALL SELECT 31 UNION ALL SELECT 32 UNION ALL SELECT 33 UNION ALL SELECT 34 UNION ALL SELECT 35
    UNION ALL SELECT 36 UNION ALL SELECT 37 UNION ALL SELECT 38 UNION ALL SELECT 39 UNION ALL SELECT 40
    UNION ALL SELECT 41 UNION ALL SELECT 42 UNION ALL SELECT 43 UNION ALL SELECT 44 UNION ALL SELECT 45
    UNION ALL SELECT 46 UNION ALL SELECT 47 UNION ALL SELECT 48 UNION ALL SELECT 49 UNION ALL SELECT 50
    UNION ALL SELECT 51 UNION ALL SELECT 52 UNION ALL SELECT 53 UNION ALL SELECT 54 UNION ALL SELECT 55
    UNION ALL SELECT 56 UNION ALL SELECT 57 UNION ALL SELECT 58 UNION ALL SELECT 59 UNION ALL SELECT 60
    UNION ALL SELECT 61 UNION ALL SELECT 62 UNION ALL SELECT 63 UNION ALL SELECT 64 UNION ALL SELECT 65
    UNION ALL SELECT 66 UNION ALL SELECT 67 UNION ALL SELECT 68 UNION ALL SELECT 69 UNION ALL SELECT 70
    UNION ALL SELECT 71 UNION ALL SELECT 72 UNION ALL SELECT 73 UNION ALL SELECT 74 UNION ALL SELECT 75
    UNION ALL SELECT 76 UNION ALL SELECT 77 UNION ALL SELECT 78 UNION ALL SELECT 79 UNION ALL SELECT 80
    UNION ALL SELECT 81 UNION ALL SELECT 82 UNION ALL SELECT 83 UNION ALL SELECT 84 UNION ALL SELECT 85
    UNION ALL SELECT 86 UNION ALL SELECT 87 UNION ALL SELECT 88 UNION ALL SELECT 89 UNION ALL SELECT 90
    UNION ALL SELECT 91 UNION ALL SELECT 92 UNION ALL SELECT 93 UNION ALL SELECT 94 UNION ALL SELECT 95
    UNION ALL SELECT 96 UNION ALL SELECT 97 UNION ALL SELECT 98 UNION ALL SELECT 99 UNION ALL SELECT 100
    UNION ALL SELECT 101 UNION ALL SELECT 102 UNION ALL SELECT 103 UNION ALL SELECT 104 UNION ALL SELECT 105
    UNION ALL SELECT 106 UNION ALL SELECT 107 UNION ALL SELECT 108 UNION ALL SELECT 109 UNION ALL SELECT 110
    UNION ALL SELECT 111 UNION ALL SELECT 112 UNION ALL SELECT 113 UNION ALL SELECT 114 UNION ALL SELECT 115
    UNION ALL SELECT 116 UNION ALL SELECT 117 UNION ALL SELECT 118 UNION ALL SELECT 119 UNION ALL SELECT 120
    UNION ALL SELECT 121 UNION ALL SELECT 122 UNION ALL SELECT 123 UNION ALL SELECT 124 UNION ALL SELECT 125
    UNION ALL SELECT 126 UNION ALL SELECT 127 UNION ALL SELECT 128 UNION ALL SELECT 129 UNION ALL SELECT 130
    UNION ALL SELECT 131 UNION ALL SELECT 132 UNION ALL SELECT 133 UNION ALL SELECT 134 UNION ALL SELECT 135
    UNION ALL SELECT 136 UNION ALL SELECT 137 UNION ALL SELECT 138 UNION ALL SELECT 139 UNION ALL SELECT 140
    UNION ALL SELECT 141 UNION ALL SELECT 142 UNION ALL SELECT 143 UNION ALL SELECT 144 UNION ALL SELECT 145
    UNION ALL SELECT 146 UNION ALL SELECT 147 UNION ALL SELECT 148 UNION ALL SELECT 149 UNION ALL SELECT 150
    UNION ALL SELECT 151 UNION ALL SELECT 152 UNION ALL SELECT 153 UNION ALL SELECT 154 UNION ALL SELECT 155
    UNION ALL SELECT 156 UNION ALL SELECT 157 UNION ALL SELECT 158 UNION ALL SELECT 159 UNION ALL SELECT 160
    UNION ALL SELECT 161 UNION ALL SELECT 162 UNION ALL SELECT 163 UNION ALL SELECT 164 UNION ALL SELECT 165
    UNION ALL SELECT 166 UNION ALL SELECT 167 UNION ALL SELECT 168 UNION ALL SELECT 169 UNION ALL SELECT 170
    UNION ALL SELECT 171 UNION ALL SELECT 172 UNION ALL SELECT 173 UNION ALL SELECT 174 UNION ALL SELECT 175
    UNION ALL SELECT 176 UNION ALL SELECT 177 UNION ALL SELECT 178 UNION ALL SELECT 179 UNION ALL SELECT 180
    UNION ALL SELECT 181 UNION ALL SELECT 182 UNION ALL SELECT 183 UNION ALL SELECT 184 UNION ALL SELECT 185
    UNION ALL SELECT 186 UNION ALL SELECT 187 UNION ALL SELECT 188 UNION ALL SELECT 189 UNION ALL SELECT 190
    UNION ALL SELECT 191 UNION ALL SELECT 192 UNION ALL SELECT 193 UNION ALL SELECT 194 UNION ALL SELECT 195
    UNION ALL SELECT 196 UNION ALL SELECT 197 UNION ALL SELECT 198 UNION ALL SELECT 199 UNION ALL SELECT 200
    UNION ALL SELECT 201 UNION ALL SELECT 202 UNION ALL SELECT 203 UNION ALL SELECT 204 UNION ALL SELECT 205
    UNION ALL SELECT 206 UNION ALL SELECT 207 UNION ALL SELECT 208 UNION ALL SELECT 209 UNION ALL SELECT 210
    UNION ALL SELECT 211 UNION ALL SELECT 212 UNION ALL SELECT 213 UNION ALL SELECT 214 UNION ALL SELECT 215
    UNION ALL SELECT 216 UNION ALL SELECT 217 UNION ALL SELECT 218 UNION ALL SELECT 219 UNION ALL SELECT 220
    UNION ALL SELECT 221 UNION ALL SELECT 222 UNION ALL SELECT 223 UNION ALL SELECT 224 UNION ALL SELECT 225
    UNION ALL SELECT 226 UNION ALL SELECT 227 UNION ALL SELECT 228 UNION ALL SELECT 229 UNION ALL SELECT 230
    UNION ALL SELECT 231 UNION ALL SELECT 232 UNION ALL SELECT 233 UNION ALL SELECT 234 UNION ALL SELECT 235
    UNION ALL SELECT 236 UNION ALL SELECT 237 UNION ALL SELECT 238 UNION ALL SELECT 239 UNION ALL SELECT 240
    UNION ALL SELECT 241 UNION ALL SELECT 242 UNION ALL SELECT 243 UNION ALL SELECT 244 UNION ALL SELECT 245
    UNION ALL SELECT 246 UNION ALL SELECT 247 UNION ALL SELECT 248 UNION ALL SELECT 249 UNION ALL SELECT 250
    UNION ALL SELECT 251 UNION ALL SELECT 252 UNION ALL SELECT 253 UNION ALL SELECT 254
) u;

-- Insert password changes (18 today)
INSERT INTO user_audit_log (user_id, action_type, performed_by, ip_address, old_value, new_value, created_at) VALUES
(1, 'password_changed', 1, '192.168.1.101', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(2, 'password_changed', 2, '192.168.1.102', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(3, 'password_changed', 3, '192.168.1.103', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(4, 'password_changed', 4, '192.168.1.104', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(5, 'password_changed', 5, '192.168.1.105', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(6, 'password_changed', 6, '192.168.1.106', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(7, 'password_changed', 7, '192.168.1.107', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(8, 'password_changed', 8, '192.168.1.108', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(9, 'password_changed', 9, '192.168.1.109', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(10, 'password_changed', 10, '192.168.1.110', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(11, 'password_changed', 11, '192.168.1.111', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(12, 'password_changed', 12, '192.168.1.112', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(13, 'password_changed', 13, '192.168.1.113', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(14, 'password_changed', 14, '192.168.1.114', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(15, 'password_changed', 15, '192.168.1.115', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(16, 'password_changed', 16, '192.168.1.116', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(17, 'password_changed', 17, '192.168.1.117', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW()),
(18, 'password_changed', 18, '192.168.1.118', JSON_OBJECT('password_changed', true), JSON_OBJECT('password_changed', true), NOW());

-- Insert reviews submitted (34 total)
INSERT INTO user_activity (user_id, session_id, is_guest, event_type, page_url, referrer_url, device_type, browser_name, ip_address, geo_country, geo_city, order_id, amount, currency, event_time, metadata, created_at) VALUES
(1, 'sess_001', 0, 'review_submitted', '/product/1/review', 'https://example.com/products', 'desktop', 'Chrome', '192.168.1.101', 'USA', 'New York', 1001, NULL, 'USD', NOW(), JSON_OBJECT('rating', 5, 'product_id', 1, 'comment', 'Great product!'), NOW()),
(2, 'sess_002', 0, 'review_submitted', '/product/2/review', 'https://example.com/products', 'mobile', 'Safari', '192.168.1.102', 'USA', 'Los Angeles', 1002, NULL, 'USD', NOW(), JSON_OBJECT('rating', 4, 'product_id', 2, 'comment', 'Good quality'), NOW()),
(3, 'sess_003', 0, 'review_submitted', '/product/3/review', 'https://example.com/products', 'desktop', 'Firefox', '192.168.1.103', 'USA', 'Chicago', 1003, NULL, 'USD', NOW(), JSON_OBJECT('rating', 5, 'product_id', 3, 'comment', 'Highly recommend'), NOW()),
(4, 'sess_004', 0, 'review_submitted', '/product/4/review', 'https://example.com/products', 'tablet', 'Chrome', '192.168.1.104', 'USA', 'Houston', 1004, NULL, 'USD', NOW(), JSON_OBJECT('rating', 3, 'product_id', 4, 'comment', 'Average product'), NOW()),
(5, 'sess_005', 0, 'review_submitted', '/product/5/review', 'https://example.com/products', 'mobile', 'Chrome', '192.168.1.105', 'USA', 'Phoenix', 1005, NULL, 'USD', NOW(), JSON_OBJECT('rating', 5, 'product_id', 5, 'comment', 'Outstanding!'), NOW()),
(6, 'sess_006', 0, 'review_submitted', '/product/6/review', 'https://example.com/products', 'desktop', 'Chrome', '192.168.1.106', 'USA', 'Philadelphia', 1006, NULL, 'USD', NOW(), JSON_OBJECT('rating', 4, 'product_id', 6, 'comment', 'Very satisfied'), NOW()),
(7, 'sess_007', 0, 'review_submitted', '/product/7/review', 'https://example.com/products', 'mobile', 'Safari', '192.168.1.107', 'USA', 'San Antonio', 1007, NULL, 'USD', NOW(), JSON_OBJECT('rating', 5, 'product_id', 7, 'comment', 'Exceeded expectations'), NOW()),
(8, 'sess_008', 0, 'review_submitted', '/product/8/review', 'https://example.com/products', 'desktop', 'Chrome', '192.168.1.108', 'USA', 'San Diego', 1008, NULL, 'USD', NOW(), JSON_OBJECT('rating', 4, 'product_id', 8, 'comment', 'Good value'), NOW()),
(9, 'sess_009', 0, 'review_submitted', '/product/9/review', 'https://example.com/products', 'mobile', 'Chrome', '192.168.1.109', 'USA', 'Dallas', 1009, NULL, 'USD', NOW(), JSON_OBJECT('rating', 5, 'product_id', 9, 'comment', 'Will buy again'), NOW()),
(10, 'sess_010', 0, 'review_submitted', '/product/10/review', 'https://example.com/products', 'tablet', 'Firefox', '192.168.1.110', 'USA', 'San Jose', 1010, NULL, 'USD', NOW(), JSON_OBJECT('rating', 3, 'product_id', 10, 'comment', 'Could be better'), NOW()),
(11, 'sess_011', 0, 'review_submitted', '/product/11/review', 'https://example.com/products', 'desktop', 'Chrome', '192.168.1.111', 'USA', 'Austin', 1011, NULL, 'USD', NOW(), JSON_OBJECT('rating', 4, 'product_id', 11, 'comment', 'Satisfied with purchase'), NOW()),
(12, 'sess_012', 0, 'review_submitted', '/product/12/review', 'https://example.com/products', 'mobile', 'Safari', '192.168.1.112', 'USA', 'Jacksonville', 1012, NULL, 'USD', NOW(), JSON_OBJECT('rating', 5, 'product_id', 12, 'comment', 'Perfect!'), NOW()),
(13, 'sess_013', 0, 'review_submitted', '/product/13/review', 'https://example.com/products', 'desktop', 'Chrome', '192.168.1.113', 'USA', 'Fort Worth', 1013, NULL, 'USD', NOW(), JSON_OBJECT('rating', 4, 'product_id', 13, 'comment', 'Quality product'), NOW()),
(14, 'sess_014', 0, 'review_submitted', '/product/14/review', 'https://example.com/products', 'mobile', 'Chrome', '192.168.1.114', 'USA', 'Columbus', 1014, NULL, 'USD', NOW(), JSON_OBJECT('rating', 5, 'product_id', 14, 'comment', 'Excellent service'), NOW()),
(15, 'sess_015', 0, 'review_submitted', '/product/15/review', 'https://example.com/products', 'tablet', 'Safari', '192.168.1.115', 'USA', 'Charlotte', 1015, NULL, 'USD', NOW(), JSON_OBJECT('rating', 4, 'product_id', 15, 'comment', 'Fast shipping'), NOW()),
(16, 'sess_016', 0, 'review_submitted', '/product/16/review', 'https://example.com/products', 'desktop', 'Chrome', '192.168.1.116', 'USA', 'San Francisco', 1016, NULL, 'USD', NOW(), JSON_OBJECT('rating', 5, 'product_id', 16, 'comment', 'Love it!'), NOW()),
(17, 'sess_017', 0, 'review_submitted', '/product/17/review', 'https://example.com/products', 'mobile', 'Chrome', '192.168.1.117', 'USA', 'Indianapolis', 1017, NULL, 'USD', NOW(), JSON_OBJECT('rating', 4, 'product_id', 17, 'comment', 'Good experience'), NOW()),
(18, 'sess_018', 0, 'review_submitted', '/product/18/review', 'https://example.com/products', 'desktop', 'Firefox', '192.168.1.118', 'USA', 'Seattle', 1018, NULL, 'USD', NOW(), JSON_OBJECT('rating', 5, 'product_id', 18, 'comment', 'Highly recommended'), NOW()),
(19, 'sess_019', 0, 'review_submitted', '/product/19/review', 'https://example.com/products', 'mobile', 'Safari', '192.168.1.119', 'USA', 'Denver', 1019, NULL, 'USD', NOW(), JSON_OBJECT('rating', 3, 'product_id', 19, 'comment', 'Okay product'), NOW()),
(20, 'sess_020', 0, 'review_submitted', '/product/20/review', 'https://example.com/products', 'desktop', 'Chrome', '192.168.1.120', 'USA', 'Washington', 1020, NULL, 'USD', NOW(), JSON_OBJECT('rating', 5, 'product_id', 20, 'comment', 'Best purchase ever'), NOW());

-- Add more reviews to reach 34 total
INSERT INTO user_activity (user_id, session_id, is_guest, event_type, page_url, referrer_url, device_type, browser_name, ip_address, geo_country, geo_city, order_id, amount, currency, event_time, metadata, created_at)
SELECT 
    u.user_id,
    CONCAT('sess_', LPAD(u.user_id + 30, 3, '0')) AS session_id,
    0 AS is_guest,
    'review_submitted' AS event_type,
    CONCAT('/product/', u.user_id % 20 + 1, '/review') AS page_url,
    'https://example.com/products' AS referrer_url,
    CASE 
        WHEN u.user_id % 3 = 0 THEN 'desktop'
        WHEN u.user_id % 3 = 1 THEN 'mobile'
        ELSE 'tablet'
    END AS device_type,
    CASE 
        WHEN u.user_id % 3 = 0 THEN 'Chrome'
        WHEN u.user_id % 3 = 1 THEN 'Safari'
        ELSE 'Firefox'
    END AS browser_name,
    CONCAT('192.168.1.', 120 + u.user_id) AS ip_address,
    'USA' AS geo_country,
    CASE 
        WHEN u.user_id % 5 = 0 THEN 'New York'
        WHEN u.user_id % 5 = 1 THEN 'Los Angeles'
        WHEN u.user_id % 5 = 2 THEN 'Chicago'
        WHEN u.user_id % 5 = 3 THEN 'Houston'
        ELSE 'Phoenix'
    END AS geo_city,
    1000 + u.user_id AS order_id,
    NULL AS amount,
    'USD' AS currency,
    NOW() AS event_time,
    JSON_OBJECT(
        'rating', 
        CASE WHEN u.user_id % 5 = 0 THEN 5 ELSE FLOOR(3 + RAND() * 3) END,
        'product_id', 
        u.user_id % 20 + 1,
        'comment', 
        CASE 
            WHEN u.user_id % 4 = 0 THEN 'Great product!'
            WHEN u.user_id % 4 = 1 THEN 'Good quality'
            WHEN u.user_id % 4 = 2 THEN 'Highly recommend'
            ELSE 'Satisfied with purchase'
        END
    ) AS metadata,
    NOW() AS created_at
FROM (
    SELECT 21 AS user_id UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL SELECT 25
    UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30
    UNION ALL SELECT 31 UNION ALL SELECT 32 UNION ALL SELECT 33 UNION ALL SELECT 34
) u;

-- Insert certifications sold (167 total) - using payment_success for certifications
INSERT INTO user_activity (user_id, session_id, is_guest, event_type, page_url, referrer_url, device_type, browser_name, ip_address, geo_country, geo_city, order_id, amount, currency, event_time, metadata, created_at) VALUES
(1, 'sess_001', 0, 'payment_success', '/checkout/success', 'https://example.com/certification', 'desktop', 'Chrome', '192.168.1.101', 'USA', 'New York', 2001, 199.99, 'USD', NOW(), JSON_OBJECT('product_type', 'certification', 'certification_id', 1), NOW()),
(2, 'sess_002', 0, 'payment_success', '/checkout/success', 'https://example.com/certification', 'mobile', 'Safari', '192.168.1.102', 'USA', 'Los Angeles', 2002, 249.99, 'USD', NOW(), JSON_OBJECT('product_type', 'certification', 'certification_id', 2), NOW()),
(3, 'sess_003', 0, 'payment_success', '/checkout/success', 'https://example.com/certification', 'desktop', 'Firefox', '192.168.1.103', 'USA', 'Chicago', 2003, 149.99, 'USD', NOW(), JSON_OBJECT('product_type', 'certification', 'certification_id', 3), NOW()),
(4, 'sess_004', 0, 'payment_success', '/checkout/success', 'https://example.com/certification', 'tablet', 'Chrome', '192.168.1.104', 'USA', 'Houston', 2004, 299.99, 'USD', NOW(), JSON_OBJECT('product_type', 'certification', 'certification_id', 4), NOW()),
(5, 'sess_005', 0, 'payment_success', '/checkout/success', 'https://example.com/certification', 'mobile', 'Chrome', '192.168.1.105', 'USA', 'Phoenix', 2005, 179.99, 'USD', NOW(), JSON_OBJECT('product_type', 'certification', 'certification_id', 5), NOW());

-- Add more certification purchases to reach 167 total
INSERT INTO user_activity (user_id, session_id, is_guest, event_type, page_url, referrer_url, device_type, browser_name, ip_address, geo_country, geo_city, order_id, amount, currency, event_time, metadata, created_at)
SELECT 
    u.user_id,
    CONCAT('sess_', LPAD(u.user_id + 30, 3, '0')) AS session_id,
    0 AS is_guest,
    'payment_success' AS event_type,
    '/checkout/success' AS page_url,
    'https://example.com/certification' AS referrer_url,
    CASE 
        WHEN u.user_id % 3 = 0 THEN 'desktop'
        WHEN u.user_id % 3 = 1 THEN 'mobile'
        ELSE 'tablet'
    END AS device_type,
    CASE 
        WHEN u.user_id % 3 = 0 THEN 'Chrome'
        WHEN u.user_id % 3 = 1 THEN 'Safari'
        ELSE 'Firefox'
    END AS browser_name,
    CONCAT('192.168.1.', 130 + u.user_id) AS ip_address,
    'USA' AS geo_country,
    CASE 
        WHEN u.user_id % 5 = 0 THEN 'New York'
        WHEN u.user_id % 5 = 1 THEN 'Los Angeles'
        WHEN u.user_id % 5 = 2 THEN 'Chicago'
        WHEN u.user_id % 5 = 3 THEN 'Houston'
        ELSE 'Phoenix'
    END AS geo_city,
    2000 + u.user_id AS order_id,
    CASE 
        WHEN u.user_id % 4 = 0 THEN 199.99
        WHEN u.user_id % 4 = 1 THEN 249.99
        WHEN u.user_id % 4 = 2 THEN 149.99
        ELSE 299.99
    END AS amount,
    'USD' AS currency,
    NOW() AS event_time,
    JSON_OBJECT(
        'product_type', 'certification',
        'certification_id', u.user_id % 10 + 1
    ) AS metadata,
    NOW() AS created_at
FROM (
    SELECT 6 AS user_id UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
    UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15
    UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20
    UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL SELECT 25
    UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30
    UNION ALL SELECT 31 UNION ALL SELECT 32 UNION ALL SELECT 33 UNION ALL SELECT 34 UNION ALL SELECT 35
    UNION ALL SELECT 36 UNION ALL SELECT 37 UNION ALL SELECT 38 UNION ALL SELECT 39 UNION ALL SELECT 40
    UNION ALL SELECT 41 UNION ALL SELECT 42 UNION ALL SELECT 43 UNION ALL SELECT 44 UNION ALL SELECT 45
    UNION ALL SELECT 46 UNION ALL SELECT 47 UNION ALL SELECT 48 UNION ALL SELECT 49 UNION ALL SELECT 50
    UNION ALL SELECT 51 UNION ALL SELECT 52 UNION ALL SELECT 53 UNION ALL SELECT 54 UNION ALL SELECT 55
    UNION ALL SELECT 56 UNION ALL SELECT 57 UNION ALL SELECT 58 UNION ALL SELECT 59 UNION ALL SELECT 60
    UNION ALL SELECT 61 UNION ALL SELECT 62 UNION ALL SELECT 63 UNION ALL SELECT 64 UNION ALL SELECT 65
    UNION ALL SELECT 66 UNION ALL SELECT 67 UNION ALL SELECT 68 UNION ALL SELECT 69 UNION ALL SELECT 70
    UNION ALL SELECT 71 UNION ALL SELECT 72 UNION ALL SELECT 73 UNION ALL SELECT 74 UNION ALL SELECT 75
    UNION ALL SELECT 76 UNION ALL SELECT 77 UNION ALL SELECT 78 UNION ALL SELECT 79 UNION ALL SELECT 80
    UNION ALL SELECT 81 UNION ALL SELECT 82 UNION ALL SELECT 83 UNION ALL SELECT 84 UNION ALL SELECT 85
    UNION ALL SELECT 86 UNION ALL SELECT 87 UNION ALL SELECT 88 UNION ALL SELECT 89 UNION ALL SELECT 90
    UNION ALL SELECT 91 UNION ALL SELECT 92 UNION ALL SELECT 93 UNION ALL SELECT 94 UNION ALL SELECT 95
    UNION ALL SELECT 96 UNION ALL SELECT 97 UNION ALL SELECT 98 UNION ALL SELECT 99 UNION ALL SELECT 100
    UNION ALL SELECT 101 UNION ALL SELECT 102 UNION ALL SELECT 103 UNION ALL SELECT 104 UNION ALL SELECT 105
    UNION ALL SELECT 106 UNION ALL SELECT 107 UNION ALL SELECT 108 UNION ALL SELECT 109 UNION ALL SELECT 110
    UNION ALL SELECT 111 UNION ALL SELECT 112 UNION ALL SELECT 113 UNION ALL SELECT 114 UNION ALL SELECT 115
    UNION ALL SELECT 116 UNION ALL SELECT 117 UNION ALL SELECT 118 UNION ALL SELECT 119 UNION ALL SELECT 120
    UNION ALL SELECT 121 UNION ALL SELECT 122 UNION ALL SELECT 123 UNION ALL SELECT 124 UNION ALL SELECT 125
    UNION ALL SELECT 126 UNION ALL SELECT 127 UNION ALL SELECT 128 UNION ALL SELECT 129 UNION ALL SELECT 130
    UNION ALL SELECT 131 UNION ALL SELECT 132 UNION ALL SELECT 133 UNION ALL SELECT 134 UNION ALL SELECT 135
    UNION ALL SELECT 136 UNION ALL SELECT 137 UNION ALL SELECT 138 UNION ALL SELECT 139 UNION ALL SELECT 140
    UNION ALL SELECT 141 UNION ALL SELECT 142 UNION ALL SELECT 143 UNION ALL SELECT 144 UNION ALL SELECT 145
    UNION ALL SELECT 146 UNION ALL SELECT 147 UNION ALL SELECT 148 UNION ALL SELECT 149 UNION ALL SELECT 150
    UNION ALL SELECT 151 UNION ALL SELECT 152 UNION ALL SELECT 153 UNION ALL SELECT 154 UNION ALL SELECT 155
    UNION ALL SELECT 156 UNION ALL SELECT 157 UNION ALL SELECT 158 UNION ALL SELECT 159 UNION ALL SELECT 160
    UNION ALL SELECT 161 UNION ALL SELECT 162 UNION ALL SELECT 163 UNION ALL SELECT 164 UNION ALL SELECT 165
    UNION ALL SELECT 166 UNION ALL SELECT 167
) u;