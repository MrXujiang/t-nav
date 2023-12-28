import { useState } from 'react';
import { Tabs, Button, Modal } from 'antd';
import Preson from '../assets/preson.png';
import ListCard from './components/CardList';
import { types } from '@/utils/config';
import Qt from '@/assets/qt.png';
import Cx from '@/assets/cx.png';
import Dr from '@/assets/dr.png';
import styles from './index.less';

export default function HomePage() {
  const [type, setType] = useState('online');
  const [sub_type, setSubType] = useState('all');
  const handleTabChange = (activeKey: string) => {
    setType(activeKey)
  }
  const handleSubTabChange = (activeKey: string) => {
    setSubType(activeKey)
  }
  return (
    <div className={styles.home}>
      <div className={styles.list}>
        <Tabs
          defaultActiveKey={type}
          onChange={handleTabChange}
          items={types.map((v, i) => {
            return {
              label: v.text,
              key: v.key,
              children: v.sub ? <Tabs
                defaultActiveKey="all"
                onChange={handleSubTabChange}
                items={v.sub.map((v, i) => {
                  return {
                    label: v.text,
                    key: v.key,
                    children: <ListCard key={i} type={type} sub_type={sub_type} curTab={v.key} />
                  };
                })}
              /> : <ListCard key={i} type={type} curTab={v.key} />
            };
          })}
        />
      </div>
      <div className={styles.cors}>
          <div className={styles.corTitle}>优质合作媒体</div>
          <div className={styles.cor}><img src={Cx} alt="" /></div>
          <div className={styles.cor}><img src={Qt} alt="" /></div>
          <div className={styles.cor}><img src={Dr} alt="" /></div>
          <div className={styles.cor}>
            <Button type="primary" onClick={() => {
                Modal.info({
                  title: "加下方微信咨询",
                  content: <div style={{textAlign: 'center'}}><img src={Preson} width={180} /></div>
                })
              }}>
                申请合作
            </Button>
          </div>
      </div>
    </div>
  );
}
