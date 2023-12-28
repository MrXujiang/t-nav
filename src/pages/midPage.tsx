import { Progress } from 'antd';
import { useEffect, useState } from 'react';
import { url2obj } from 'xijs';
import styles from './midPage.less';

const MidPage = (props) => {
  const [curProgress, setCurProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurProgress(prev => {
        if(prev >= 100) {
          clearInterval(timer)
          const params = url2obj(window.location.search);
          window.location.href = params.url;
        }
        return prev + 10
      })
    }, 100)
  }, [])
  return (
    <div className={styles.midPage}>
      <Progress 
        type="circle" 
        percent={curProgress} 
        strokeColor={{ '0%': '#108ee9', '100%': '#1677ff' }} 
      />
      <div style={{marginTop: 20}}>
        小橙正在为您加速跳转中...
      </div>
    </div>
  );
};

export default MidPage;
