import { Outlet, history } from 'umi';
import { 
  Button, 
  Input, 
  Tag, 
  ConfigProvider, 
  Modal, 
  Form, 
  Popover,
  Rate,
  Select,
  InputNumber
} from 'antd';
import { useEffect, useState } from 'react';
import codeJpg from '../assets/xx.jpeg';
import Logo from '../assets/logo.png';
import Preson from '../assets/preson.png';
import zhCN from 'antd/locale/zh_CN';
import { url2obj } from 'xijs';
import { setToken, getToken } from '@/utils/req'
import { 
  loginApi,
  addListApi,
  modListApi
 } from '@/api';
import { types, sub_types } from '@/utils/config';
import MyUpload from '@/components/Upload';
import styles from './index.less';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function Layout() {
  const [showLogin, setShowLogin] = useState(false);
  const [canPublish, setCanPublish] = useState(false);
  const [loginForm] = Form.useForm();
  const [pubForm] = Form.useForm();
  const [keyword, setKeyWord] = useState('');
  const onSearch = (value: string) => {
    setKeyWord(value)
  }
  const handleOk = () => {
    loginForm.validateFields().then(values => {
      const { username, password } = values;
      loginApi({
        name: username,
        pwd: password
      }).then(res => {
        const { data: { token } } = res;
        setToken(token);
        history.push('/');
        setShowLogin(false)
      })
    });
  }
  const handleCancel = () => {
    setShowLogin(false)
  }

  const handlePubOk = () => {
    pubForm.validateFields().then(values => {
      if(values.id) {
        modListApi(values).then(res => {
          setCanPublish(false)
        })
        return
      }

      addListApi(values).then(res => {
        setCanPublish(false)
      })
    });
  }

  const handleShowPublish = () => {
    if(getToken()) {
      setCanPublish(true);
      pubForm.resetFields();
    }else {
      Modal.info({
        title: "加下方微信申请",
        content: <div style={{textAlign: 'center'}}><img src={Preson} width={180} /></div>
      })
    }
  }
  const handlePubCancel = () => {
    setCanPublish(false);
  }

  const handlePubEdit = (row: any) => {
    setCanPublish(true);
    pubForm.setFieldsValue({
      ...row
    })
  }

  useEffect(() => {
    const search = window.location.search;
    const loginFlag = url2obj(search)?.flag;
    if(+loginFlag === 1) {
      setShowLogin(true);
    }
  }, [])
  return (
    <ConfigProvider locale={zhCN}>
      <div className={styles.wrap}>
        <header className={styles.navs}>
          <div className={styles.logo}>
            <img src={Logo} alt="" />
            <span>工具导航 <Tag color="blue-inverse">Ctrl + D 收藏网站</Tag></span>
          </div>
          <div className={styles.searchArea}>
            <Search placeholder="搜索软件/工具/资源" onSearch={onSearch} enterButton />
          </div>
          <div className={styles.menu}>
            <div className={styles.menuItem}>
            <Popover placement="bottom" content={<img src={codeJpg} width={160} />} trigger="hover">
              官方媒体
            </Popover>
            </div>
            <div className={styles.menuItem}>
              <Popover placement="bottom" content={<img src={Preson} width={160} />} trigger="hover">
                合作咨询
              </Popover>
            </div>
            <div className={styles.menuItem}>
              <Popover placement="bottom" content={<img src={Preson} width={160} />} trigger="hover">
                技术服务
              </Popover>
            </div>
            <Button type='primary' onClick={handleShowPublish}>投稿</Button>
          </div>
        </header>
        <main>
          <Outlet context={{ keyword, onItemEdit: handlePubEdit }} />
        </main>
        <footer>
          <div className={styles.first}>
            <div className={styles.code}>
              <img src={codeJpg} alt="橙讯点评" />
            </div>
            <div className={styles.content}>
              <div className={styles.title}>分享最实用前沿的应用和工具</div>
              <div className={styles.desc}>软件交流: cxzk_168</div>
              <div className={styles.friendLink}>
                友情链接: 
                <a href="https://dooring.vip"> Dooring零代码 </a>
              </div>
            </div>
          </div>
          <div className={styles.second}>
            ©版权所有: 趣谈前端 - Dooring 
          </div>
        </footer>
        <Modal title="登录" open={showLogin} onOk={handleOk} onCancel={handleCancel} width={450}>
          <Form
            name="cx-login"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 420 }}
            autoComplete="off"
            form={loginForm}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
        <Modal title="投稿/发布" open={canPublish} onOk={handlePubOk} onCancel={handlePubCancel} width={580}>
          <Form
            name="cx-publish"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 520 }}
            autoComplete="off"
            form={pubForm}
          >
            <Form.Item
              label="id"
              name="id"
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="软件标题"
              name="title"
              rules={[{ required: true, message: '请输入软件标题!' }]}
            >
              <Input placeholder='请输入标题' />
            </Form.Item>
            <Form.Item
              label="软件类型"
              name="type"
              rules={[{ required: true, message: '请输入软件类型!' }]}
            >
              <Select
                placeholder="请输入软件类型"
                allowClear
              >
                {
                  types.map(v => {
                    return <Option key={v.key} value={v.key}>{ v.text }</Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
            >
              {({ getFieldValue }) =>
                getFieldValue('type') === 'online' ? (
                  <Form.Item
                    label="软件分类"
                    name="sub_type"
                    rules={[{ required: true, message: '请输入软件分类!' }]}
                  >
                    
                    <Select
                      placeholder="请输入软件分类"
                      allowClear
                    >
                      {
                        sub_types.slice(1).map(v => {
                          return <Option key={v.key} value={v.key}>{ v.text }</Option>
                        })
                      }
                    </Select>
                  </Form.Item>
                ) : null
              }
            </Form.Item>
            <Form.Item
              label="标签"
              name="tags"
              rules={[{ required: true, message: '请输入软件标签!' }]}
            >
              <Select
                placeholder="请输入软件标签"
                allowClear
                mode="tags"
              />
            </Form.Item>
            <Form.Item
              label="分享图标"
              name="icon"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <MyUpload />
            </Form.Item>
            <Form.Item
              label="产品展示图"
              name="img"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: '请上传图片!' }]}
            >
              <MyUpload />
            </Form.Item>
            <Form.Item
              label="封面索引"
              name="index"
              rules={[{ required: true, message: '请输入!' }]}
            >
              <InputNumber placeholder='请输入' />
            </Form.Item>
            <Form.Item
              label="评分"
              name="star"
              rules={[{ required: true, message: '请输入软件评分!' }]}
            >
              <Rate allowHalf />
            </Form.Item>
            <Form.Item
              label="网址"
              name="url"
              rules={[{ required: true, message: '请输入软件地址!' }]}
            >
              <Input placeholder='请输入网址' />
            </Form.Item>
            <Form.Item
              label="软件简介"
              name="desc"
              rules={[{ required: true, message: '请输入软件简介!' }]}
            >
              <TextArea rows={3} placeholder='请输入软件简介' />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider> 
  );
}
