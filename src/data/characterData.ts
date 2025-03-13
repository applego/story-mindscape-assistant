
export interface CharacterRelationship {
  targetId: string;
  type: string; // 例: "友人", "敵", "恋人" など
  description: string;
}

export interface Character {
  id: string;
  name: string;
  personality: string; // 「○○すぎる」性格
  strengths: string; // 長所（憧れ性）
  weaknesses: string; // 短所（共通性）
  background: string; // 背景
  role: string; // 物語での役割
  goal?: string; // 目標
  conflict?: string; // 葛藤
  futureHook?: string; // 未来へのフック
  pastHook?: string; // 過去へのフック
  presentHook?: string; // 現在へのフック
  relationships?: CharacterRelationship[];
}
