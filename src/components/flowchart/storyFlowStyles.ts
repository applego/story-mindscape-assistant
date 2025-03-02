
import { css } from '@emotion/css';

export const nodeTypeColors = {
  ki: { 
    background: '#E6F7FF', 
    border: '#1890FF',
    label: '起：序章',
    description: '物語の始まり・導入部'
  },
  sho: { 
    background: '#F6FFED', 
    border: '#52C41A',
    label: '承：展開',
    description: '物語の展開・伏線'
  },
  ten: { 
    background: '#FFF7E6', 
    border: '#FA8C16',
    label: '転：山場',
    description: '物語の転換点・クライマックス'
  },
  ketsu: { 
    background: '#F9F0FF', 
    border: '#722ED1',
    label: '結：結末',
    description: '物語の結末・まとめ'
  }
};

export const flowStyles = {
  // ノードタイプごとのCSS
  nodeKi: css`
    background-color: ${nodeTypeColors.ki.background};
    border-color: ${nodeTypeColors.ki.border};
    border-left: 4px solid ${nodeTypeColors.ki.border};
  `,
  nodeSho: css`
    background-color: ${nodeTypeColors.sho.background};
    border-color: ${nodeTypeColors.sho.border};
    border-left: 4px solid ${nodeTypeColors.sho.border};
  `,
  nodeTen: css`
    background-color: ${nodeTypeColors.ten.background};
    border-color: ${nodeTypeColors.ten.border};
    border-left: 4px solid ${nodeTypeColors.ten.border};
  `,
  nodeKetsu: css`
    background-color: ${nodeTypeColors.ketsu.background};
    border-color: ${nodeTypeColors.ketsu.border};
    border-left: 4px solid ${nodeTypeColors.ketsu.border};
  `,
};
