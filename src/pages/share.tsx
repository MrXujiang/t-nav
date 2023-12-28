import { Button, Tag, Carousel, Rate, Divider, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import { url2obj, formatDate, isPc } from 'xijs';
import wx from 'weixin-js-sdk';
import { getDetailApi, getWxConfigApi } from '@/api';
import codeJpg from '../assets/xx.jpeg';
import styles from './share.less';

const contentStyle: React.CSSProperties = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const SharePage = (props) => {
  const { id } = url2obj(location.search);
  const [detail, setDetail] = useState({});

  const wxShare = (obj, callback) => {
    let url = window.location.href.split('#')[0]
  
    if (obj) {
      var title = !obj.title ? '橙讯点评软件分享' : obj.title
      var link = !obj.link ? window.location.href : obj.link
      var desc = !obj.desc ? '每天分享优质软件工具' : obj.desc
      var imgUrl = !obj.imgUrl ? 'https://turntip.cn/cxzk/static/image/cxzk_logo_a.png' : obj.imgUrl
      var debug = obj.debug == true
    } else {
      alert('请传分享参数')
    }

    getWxConfigApi(url).then(res => {
      let wxConf = res.data;
      wx.config({
        debug: false,
        appId: wxConf.appId,
        timestamp: wxConf.timestamp,
        nonceStr: wxConf.nonceStr,
        signature: wxConf.signature,
        jsApiList: wxConf.jsApiList
      })
      wx.ready(function () {
        // 分享给朋友
        wx.updateAppMessageShareData({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: link, // 分享链接
          imgUrl: imgUrl, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
            callback && callback()
          }
        })
  
        // 分享到朋友圈
        wx.updateTimelineShareData({
          title: title, // 分享标题
          link: link, // 分享链接
          desc: desc, // 分享描述
          imgUrl: imgUrl, // 分享图标
          success: function () {
            callback && callback()
          }
        })
      })
    })
  }

  useEffect(() => {
    getDetailApi(id).then(res => {
      const { data } = res;
      setDetail(data);
      if (!isPc()) {
        wxShare({
          title: data.title, // 分享标题
          desc: data.desc, // 分享描述
          link: window.location.href, // 分享链接
          imgUrl: data.icon && data.icon[0] && data.icon[0].url
          //debug:true
        }, function () { });
      }
    })
  }, [])
  
  return (
    !detail.title ? <div style={{textAlign: 'center', height: '100vh', paddingTop: 100}}><Spin size="large" /></div>
    : <div className={styles.sharePage}>
      <div className={styles.card}>
        <div className={styles.title}>{ detail.title }</div>
        <div className={styles.tags}>
          {
            detail.tags.map(v => {
              return <Tag key={v} color="processing" bordered={false}>{ v }</Tag>
            })
          }
        </div>
        <div className={styles.imgBoxs}>
        <Carousel autoplay>
          {
            detail.img.map((v, i) => {
              return <div key={i}>
                <img src={v.url} />
              </div>
            })
          }
        </Carousel>
        </div>
        <div className={styles.desc}>
          { detail.desc }
        </div>
        <div className={styles.rate}>
          评分: <Rate disabled value={detail.star} allowHalf />
        </div>
        <div className={styles.rate}>
          投稿时间: { formatDate(detail.ct, 'YY/MM/DD hh:mm:ss') }
        </div>
        <div className={styles.controlArea}>
          <Button type="primary" onClick={() => {
            history.push(`/midPage?url=${detail.url}`)
          }}>立即体验</Button>
          <Button style={{marginLeft: 20}} onClick={() => {
            history.push('/')
          }}>更多工具推荐</Button>
        </div>
        <div className={styles.more}>
          <h3><Divider>更多精彩</Divider></h3>
          <div className={styles.moreImg}>
            <img src={codeJpg} width={150} alt="" />
          </div>
        </div>
      </div>
      <footer>版权所有: <a href="https://www.turntip.cn"> 橙讯点评 </a></footer>
    </div>
  );
};

export default SharePage;
