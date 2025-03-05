
export interface PlotTemplate {
  id: string;
  name: string;
  description: string;
  nodes: {
    id: string;
    type: string;
    label: string;
    description: string;
    phase: 'ki' | 'sho' | 'ten' | 'ketsu';
    timePosition: number;
  }[];
}

export const plotTemplates: PlotTemplate[] = [
  {
    id: "heroes-journey",
    name: "ヒーローズ・ジャーニー",
    description: "主人公が冒険に出て困難を乗り越え、変化して戻ってくる物語構造",
    nodes: [
      {
        id: "node-1",
        type: "scene",
        label: "日常世界",
        description: "主人公の通常世界を描写し、物語の世界観を確立する。",
        phase: "ki",
        timePosition: 0
      },
      {
        id: "node-2",
        type: "scene",
        label: "冒険への誘い",
        description: "主人公が冒険に誘われるか、平穏な日常に変化が起きる。",
        phase: "ki",
        timePosition: 15
      },
      {
        id: "node-3",
        type: "scene",
        label: "冒険の拒否",
        description: "主人公は最初、冒険を拒否するか迷う。",
        phase: "ki",
        timePosition: 25
      },
      {
        id: "node-4",
        type: "scene",
        label: "師との出会い",
        description: "主人公は指導者や助言者と出会う。",
        phase: "sho",
        timePosition: 35
      },
      {
        id: "node-5",
        type: "scene",
        label: "冒険世界への越境",
        description: "主人公は冒険の世界に踏み込む。",
        phase: "sho",
        timePosition: 45
      },
      {
        id: "node-6",
        type: "scene",
        label: "試練と仲間",
        description: "主人公は試練に直面し、仲間と出会う。",
        phase: "ten",
        timePosition: 55
      },
      {
        id: "node-7",
        type: "scene",
        label: "最大の試練",
        description: "主人公は最大の危機や試練に直面する。",
        phase: "ten",
        timePosition: 65
      },
      {
        id: "node-8",
        type: "scene",
        label: "報酬",
        description: "主人公は試練を乗り越え、報酬を得る。",
        phase: "ketsu",
        timePosition: 75
      },
      {
        id: "node-9",
        type: "scene",
        label: "帰還",
        description: "主人公は元の世界に戻る、あるいは新たな世界で生きる。",
        phase: "ketsu",
        timePosition: 85
      },
      {
        id: "node-10",
        type: "scene",
        label: "変化した主人公",
        description: "主人公は内面的・外面的に変化を遂げ、新たな力を持つ。",
        phase: "ketsu",
        timePosition: 95
      }
    ]
  },
  {
    id: "kishotenketsu",
    name: "起承転結",
    description: "日本の伝統的な四段構成の物語構造",
    nodes: [
      {
        id: "node-1",
        type: "scene",
        label: "起：主人公の日常",
        description: "主人公の通常世界を描写し、物語の世界観を確立する。",
        phase: "ki",
        timePosition: 0
      },
      {
        id: "node-2",
        type: "scene",
        label: "起：問題の芽生え",
        description: "物語の中心となる問題や目標が提示される。",
        phase: "ki",
        timePosition: 20
      },
      {
        id: "node-3",
        type: "scene",
        label: "承：問題の発展",
        description: "問題が発展し、主人公の行動が始まる。",
        phase: "sho",
        timePosition: 40
      },
      {
        id: "node-4",
        type: "scene",
        label: "転：予想外の展開",
        description: "物語が予想外の方向に転換する。",
        phase: "ten",
        timePosition: 60
      },
      {
        id: "node-5",
        type: "scene",
        label: "結：解決と締めくくり",
        description: "物語の結末。問題が解決し、主人公に変化が起きる。",
        phase: "ketsu",
        timePosition: 80
      }
    ]
  },
  {
    id: "three-act",
    name: "三幕構成",
    description: "セットアップ、対立、解決の3段階で物語を構成する手法",
    nodes: [
      {
        id: "node-1",
        type: "scene",
        label: "第一幕：セットアップ",
        description: "物語の世界と主人公を紹介し、問題を提示する。",
        phase: "ki",
        timePosition: 10
      },
      {
        id: "node-2",
        type: "scene",
        label: "第一の転換点",
        description: "主人公が本格的に問題に関わることを決意する瞬間。",
        phase: "ki",
        timePosition: 25
      },
      {
        id: "node-3",
        type: "scene",
        label: "第二幕：対立",
        description: "主人公が問題に立ち向かう中で様々な障害に直面する。",
        phase: "sho",
        timePosition: 40
      },
      {
        id: "node-4",
        type: "scene",
        label: "ミッドポイント",
        description: "物語の中間点。主人公の目標や方向性が変わる瞬間。",
        phase: "ten",
        timePosition: 50
      },
      {
        id: "node-5",
        type: "scene",
        label: "第二の転換点",
        description: "主人公が最大の危機に直面し、解決へ向かう決意をする瞬間。",
        phase: "ten",
        timePosition: 75
      },
      {
        id: "node-6",
        type: "scene",
        label: "第三幕：解決",
        description: "クライマックスと結末。問題が解決し、主人公が変化する。",
        phase: "ketsu",
        timePosition: 90
      }
    ]
  }
];
