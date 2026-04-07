--liquibase formatted sql

--changeset portfolio:030-seed-mgm-life-items runOnChange:false
--comment: Seed initial MGM Life media items

INSERT INTO mgm_life_items (title, description, media_type, media_url, thumbnail_url, category, sort_order, published)
VALUES
  (
    'English Class - Outdoor Session',
    'Buổi học tiếng Anh ngoài trời — học viên và giáo viên cùng nhau khám phá thành phố trong giờ học.',
    'IMAGE',
    'https://drive.google.com/uc?export=view&id=1EvGNzQ5tmhG6sf0-WCY6aI3VH7ElYJih',
    NULL,
    'ENGLISH_CLASS',
    1,
    TRUE
  ),
  (
    'English Class',
    'Lớp học tiếng Anh 2 tiếng mỗi ngày tại văn phòng — được tính như giờ lương.',
    'IMAGE',
    'https://drive.google.com/uc?export=view&id=19QqwZGUpQgAvUwl_ZdiX6VZ3WAlRosFX',
    NULL,
    'ENGLISH_CLASS',
    2,
    TRUE
  ),
  (
    'Nấu mì tôm tại văn phòng',
    'Những buổi chiều muộn, team cùng nhau nấu mì tôm — khoảnh khắc bình dị nhất tại mgm.',
    'IMAGE',
    'https://drive.google.com/uc?export=view&id=13HcKoP-xkU6zLAkVG93vzUCtdg-WT9Xk',
    NULL,
    'GENERAL',
    1,
    TRUE
  ),
  (
    'Piano tại văn phòng',
    'Chiếc đàn piano tại văn phòng mgm — nơi mọi người thư giãn và thể hiện niềm đam mê âm nhạc.',
    'IMAGE',
    'https://drive.google.com/uc?export=view&id=1ZEsaj7zr0UHGTyOHBv9vKMfSWXIWJ0mi',
    NULL,
    'GENERAL',
    2,
    TRUE
  );
