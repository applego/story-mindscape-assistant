
export interface Character {
  id: string;
  name: string;
  personality: string;
  strengths: string;
  weaknesses: string;
  background: string;
  role: string;
  relationships?: Array<{
    targetId: string;
    type: "friend" | "enemy" | "family" | "romantic" | "mentor" | "other";
    description: string;
  }>;
}

// サンプルキャラクターデータ
export const exampleCharacters: Character[] = [
  {
    id: "char1",
    name: "田中 誠",
    personality: "正義感が強すぎる",
    strengths: "どんな状況でも正しいことを貫き通す勇気がある。誰に対しても公平で親切。",
    weaknesses: "融通が利かず、時に頑固すぎて周囲との軋轢を生む。自分を犠牲にしがち。",
    background: "警察官の家庭に育ち、幼い頃から正義と秩序の大切さを教えられてきた。大学時代に起きた友人の不審な事故をきっかけに、真実を追求する道を選んだ。",
    role: "主人公",
    relationships: [
      {
        targetId: "char2",
        type: "friend",
        description: "幼馴染で信頼できる相談相手。時に主人公の頑固さを諌める役割も。"
      }
    ]
  },
  {
    id: "char2",
    name: "佐藤 葉子",
    personality: "好奇心が強すぎる",
    strengths: "鋭い観察眼と分析力。どんな謎も解き明かそうとする情熱。",
    weaknesses: "時に危険を顧みない無謀さ。秘密を知りたいあまり人の境界線を越えることも。",
    background: "科学者の父を持ち、幼い頃から実験や観察を通して世界を理解することを学んだ。大学ではジャーナリズムを専攻し、真実を追求する道を選んだ。",
    role: "協力者/親友",
    relationships: [
      {
        targetId: "char1",
        type: "friend",
        description: "主人公とは正反対の性格だが、真実を追求する点で共鳴し合う親友。"
      }
    ]
  }
];
