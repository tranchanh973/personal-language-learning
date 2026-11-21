import { factoryWords } from './factory-words';

export type Level = 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4';

export interface Translation {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface Word extends Translation {
  id: string;
  level: Level;
  example: Translation;
  factory?: true;
}

export const words: readonly Word[] = [
  {"id": "ni-hao", "hanzi": "你好", "pinyin": "nǐ hǎo", "meaning": "Xin chào", "level": "HSK 1", "example": {"hanzi": "你好！", "pinyin": "nǐ hǎo!", "meaning": "Xin chào!"}},
  {"id": "xie-xie", "hanzi": "谢谢", "pinyin": "xièxie", "meaning": "Cảm ơn", "level": "HSK 1", "example": {"hanzi": "谢谢你。", "pinyin": "xièxie nǐ.", "meaning": "Cảm ơn bạn."}},
  {"id": "wo", "hanzi": "我", "pinyin": "wǒ", "meaning": "Tôi", "level": "HSK 1", "example": {"hanzi": "我是学生。", "pinyin": "wǒ shì xuésheng.", "meaning": "Tôi là học sinh."}},
  {"id": "ni", "hanzi": "你", "pinyin": "nǐ", "meaning": "Bạn", "level": "HSK 1", "example": {"hanzi": "你好吗？", "pinyin": "nǐ hǎo ma?", "meaning": "Bạn khỏe không?"}},
  {"id": "shi", "hanzi": "是", "pinyin": "shì", "meaning": "Là", "level": "HSK 1", "example": {"hanzi": "他是老师。", "pinyin": "tā shì lǎoshī.", "meaning": "Anh ấy là giáo viên."}},
  {"id": "xue-sheng", "hanzi": "学生", "pinyin": "xuésheng", "meaning": "Học sinh", "level": "HSK 1", "example": {"hanzi": "我是学生。", "pinyin": "wǒ shì xuésheng.", "meaning": "Tôi là học sinh."}},
  {"id": "lao-shi", "hanzi": "老师", "pinyin": "lǎoshī", "meaning": "Giáo viên", "level": "HSK 1", "example": {"hanzi": "她是老师。", "pinyin": "tā shì lǎoshī.", "meaning": "Cô ấy là giáo viên."}},
  {"id": "xi-huan", "hanzi": "喜欢", "pinyin": "xǐhuan", "meaning": "Thích", "level": "HSK 1", "example": {"hanzi": "我喜欢茶。", "pinyin": "wǒ xǐhuan chá.", "meaning": "Tôi thích trà."}},
  {"id": "he", "hanzi": "喝", "pinyin": "hē", "meaning": "Uống", "level": "HSK 1", "example": {"hanzi": "我喝水。", "pinyin": "wǒ hē shuǐ.", "meaning": "Tôi uống nước."}},
  {"id": "shui", "hanzi": "水", "pinyin": "shuǐ", "meaning": "Nước", "level": "HSK 1", "example": {"hanzi": "我喝水。", "pinyin": "wǒ hē shuǐ.", "meaning": "Tôi uống nước."}},
  {"id": "peng-you", "hanzi": "朋友", "pinyin": "péngyou", "meaning": "Bạn bè", "level": "HSK 1", "example": {"hanzi": "他是我的朋友。", "pinyin": "tā shì wǒ de péngyou.", "meaning": "Anh ấy là bạn tôi."}},
  {"id": "xue-xi", "hanzi": "学习", "pinyin": "xuéxí", "meaning": "Học tập", "level": "HSK 1", "example": {"hanzi": "我学习中文。", "pinyin": "wǒ xuéxí zhōngwén.", "meaning": "Tôi học tiếng Trung."}},
  {"id": "yin-wei", "hanzi": "因为", "pinyin": "yīnwèi", "meaning": "Bởi vì", "level": "HSK 2", "example": {"hanzi": "因为下雨，我不去。", "pinyin": "yīnwèi xià yǔ, wǒ bú qù.", "meaning": "Vì trời mưa nên tôi không đi."}},
  {"id": "suo-yi", "hanzi": "所以", "pinyin": "suǒyǐ", "meaning": "Cho nên", "level": "HSK 2", "example": {"hanzi": "我累了，所以休息。", "pinyin": "wǒ lèi le, suǒyǐ xiūxi.", "meaning": "Tôi mệt nên nghỉ ngơi."}},
  {"id": "yi-jing", "hanzi": "已经", "pinyin": "yǐjīng", "meaning": "Đã", "level": "HSK 2", "example": {"hanzi": "我已经吃饭了。", "pinyin": "wǒ yǐjīng chī fàn le.", "meaning": "Tôi đã ăn cơm rồi."}},
  {"id": "jue-de", "hanzi": "觉得", "pinyin": "juéde", "meaning": "Cảm thấy, cho rằng", "level": "HSK 2", "example": {"hanzi": "我觉得很好。", "pinyin": "wǒ juéde hěn hǎo.", "meaning": "Tôi thấy rất tốt."}},
  {"id": "yi-qi", "hanzi": "一起", "pinyin": "yìqǐ", "meaning": "Cùng nhau", "level": "HSK 2", "example": {"hanzi": "我们一起学习。", "pinyin": "wǒmen yìqǐ xuéxí.", "meaning": "Chúng ta cùng học."}},
  {"id": "yun-dong", "hanzi": "运动", "pinyin": "yùndòng", "meaning": "Vận động, thể thao", "level": "HSK 2", "example": {"hanzi": "我喜欢运动。", "pinyin": "wǒ xǐhuan yùndòng.", "meaning": "Tôi thích thể thao."}},
  ...factoryWords,
];

export interface Lesson {
  id: string;
  title: string;
  level: Level;
  text: string;
  note: string;
}

export const lessons: readonly Lesson[] = [
  {id:'greetings',title:'Chào hỏi và giới thiệu',level:'HSK 1',text:'Mẫu câu: 我是学生。 (wǒ shì xuésheng.) — Tôi là học sinh.',note:'Cấu trúc: Chủ ngữ + 是 (shì — là) + danh từ. Ví dụ: 她是老师。 (tā shì lǎoshī.) — Cô ấy là giáo viên.'},
  {id:'interests',title:'Sở thích và sinh hoạt',level:'HSK 1',text:'Mẫu câu: 我喜欢喝茶。 (wǒ xǐhuan hē chá.) — Tôi thích uống trà.',note:'Cấu trúc: Chủ ngữ + 喜欢 (xǐhuan — thích) + động từ hoặc danh từ.'},
  {id:'cause-effect',title:'Nguyên nhân và kết quả',level:'HSK 2',text:'Mẫu câu: 因为下雨，所以我不去。 (yīnwèi xià yǔ, suǒyǐ wǒ bú qù.) — Vì trời mưa nên tôi không đi.',note:'Cấu trúc: 因为 (yīnwèi — bởi vì) + nguyên nhân, 所以 (suǒyǐ — cho nên) + kết quả.'},
  {id:'factory-intro',title:'Giới thiệu khi mới vào xưởng',level:'HSK 1',text:'我是新来的。请问，我在哪儿工作？ (Wǒ shì xīn lái de. Qǐngwèn, wǒ zài nǎr gōngzuò?) — Tôi là người mới. Cho tôi hỏi, tôi làm ở đâu?',note:'Dùng 请问 để mở đầu câu hỏi lịch sự. Nếu nghe chưa kịp, nói 请慢一点儿说。 (Qǐng màn yìdiǎnr shuō.) — Vui lòng nói chậm một chút.'},
  {id:'factory-shift',title:'Hỏi giờ vào ca và xin hỗ trợ',level:'HSK 2',text:'我明天几点上班？ (Wǒ míngtiān jǐ diǎn shàngbān?) — Mai tôi vào ca lúc mấy giờ?',note:'Khi chưa biết cách làm, hỏi 你能教我怎么做吗？ (Nǐ néng jiāo wǒ zěnme zuò ma?) — Bạn chỉ tôi cách làm được không?'},
  {id:'factory-safety',title:'Báo máy dừng và nhờ tổ trưởng',level:'HSK 3',text:'二号车间的机器停了，请通知组长。 (Èr hào chējiān de jīqì tíng le, qǐng tōngzhī zǔzhǎng.) — Máy ở xưởng số 2 đã dừng, vui lòng báo tổ trưởng.',note:'Khi báo sự cố, nói rõ vị trí, thiết bị và dấu hiệu bạn quan sát thấy. Ví dụ 有异常声音。 (Yǒu yìcháng shēngyīn.) — Có tiếng kêu bất thường.'},
  {id:'factory-qc',title:'Báo hàng lỗi và bàn giao ca',level:'HSK 4',text:'这一批有三个不良品，已经单独放好了。 (Zhè yì pī yǒu sān ge bùliángpǐn, yǐjīng dāndú fàng hǎo le.) — Lô này có ba sản phẩm lỗi, đã để riêng rồi.',note:'Khi bàn giao, nêu lô, số lượng và phần việc còn lại. 还需要复检。 (Hái xūyào fùjiǎn.) — Vẫn cần kiểm tra lại.'},
];
