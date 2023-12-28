import { Pagination, Tag, Empty, Modal } from 'antd'
import {
    ShareAltOutlined,
    LinkOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    EditOutlined
  } from '@ant-design/icons';
import { getListApi, delListApi } from '@/api';
import { useState, useEffect, useMemo, memo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { formatDate, isPc } from 'xijs';
import { getToken } from '@/utils/req';
import { useOutletContext, history, Link } from 'umi';
import styles from './index.less'

interface IProps {
    type: string;
    sub_type: string;
    curTab: string;
}

export default memo((props: IProps) => {
    const { type, sub_type, curTab } = props;
    const [refresh, setRefresh] = useState(0);
    const [total, setTotal] = useState(0);
    const [modal, contextHolder] = Modal.useModal();
    const [list, setList] = useState([]);

    const [pager, setPager] = useState({
        type: 'online',
        sub_type: '',
        page: 1,
        pagesize: 12
    })

    const { keyword, onItemEdit } = useOutletContext();

    const handlePageChange = (page: number) => {
        setPager(prev => {
            return {
                ...prev,
                page
            }
        })
    }

    const handlePageSizeChange = (current: number, pagesize: number) => {
        setPager(prev => {
            return {
                ...prev,
                page: current,
                pagesize
            }
        })
    }

    const handleNewPage = (url: string) => {
        const a = document.createElement('a');
        a.setAttribute('href', `/midPage?url=${url}`);
        a.setAttribute('target', '_blank');
        a.setAttribute('id', 'cxzk_to_new_page');
        // 防止反复添加
        if(document.getElementById('cxzk_to_new_page')) {
            document.body.removeChild(document.getElementById('cxzk_to_new_page'));
        }
        document.body.appendChild(a);
        a.click();
    }

    const handleDelItem = (id: string) => {
        modal.confirm({
            title: '确认要删除吗?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Bla bla ...',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                delListApi(id)
                setRefresh(Date.now())
            }
          });
    }

    const handleEditItem = (row: any) => {
        onItemEdit && onItemEdit(row)
    }

    const handleShare = (id: string) => {
        console.log(isPc())
        if(isPc()) {
            modal.info({
                title: '扫描二维码分享',
                icon: <ExclamationCircleOutlined />,
                content: <div style={{textAlign: 'center', paddingTop: 20}}>
                    <QRCodeCanvas value={`${serverApi}/h5?id=${id}`} />
                </div>,
                okText: '确认'
              });
        }else {
            history.push(`/h5?id=${id}`)
        }
    }

    useEffect(() => {
        if(
            (type === 'online' && ((!sub_type || !curTab) || curTab !== sub_type))      
            ||
            (type !== 'online' && curTab !== type)
        ) return 
        getListApi({
            ...pager,
            type, 
            sub_type: sub_type === 'all' ? '' : sub_type,
            keyword
        }).then(res => {
            const { data: { list, total } } = res;
            setList(list);
            setTotal(total);
        })
        
    }, [pager, keyword, refresh])


    return <div className={styles.listWrap}>
        <div className={styles.list}>
            {
                list.map(v => {
                    return <div className={styles.listItem} key={v.id}>
                        <div className={styles.imgBox}>
                            <img src={v.img[v.index - 1 > -1 ? v.index - 1 : 0]?.url} alt={v.title} />
                        </div>
                        <div className={styles.content}>
                            <div className={styles.title} onClick={() => handleNewPage(v.url)}>{ v.title }</div>
                            <div className={styles.tags}>
                                {
                                    v.tags.map((v, i) => {
                                        return <Tag color="processing" bordered={false} key={i}>{ v }</Tag>
                                    })
                                }
                            </div>
                            <div className={styles.desc}>{ v.desc }</div>
                            <div className={styles.footer}>
                                <span className={styles.time}>{ formatDate(+v.ct, 'YY-MM-DD') }</span>
                                <span className={styles.star}></span>
                                <div className={styles.control}>
                                    <span className={styles.item} onClick={() => handleNewPage(v.url)}><LinkOutlined /></span>
                                    <span className={styles.item} onClick={() => handleShare(v.id)}>
                                        <ShareAltOutlined />
                                    </span>
                                    {
                                        !!getToken() && 
                                        <>
                                            <span className={styles.item} onClick={() => handleEditItem(v)}><EditOutlined /></span>
                                            <span className={styles.item} onClick={() => handleDelItem(v.id)}><DeleteOutlined /></span>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                })
            }

            {
                !list.length &&
                <div className={styles.empty}>
                    <Empty
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        imageStyle={{ height: 60 }}
                        description="暂无数据"
                    />
                </div>
            }
            
        </div>
        {
            !!total &&
            <div className={styles.pagation}>
                <Pagination 
                    defaultCurrent={1}
                    pageSize={pager.pagesize} 
                    total={total} 
                    showTotal={(total) => `总数:  ${total} 条`}
                    onChange={handlePageChange} 
                    onShowSizeChange={handlePageSizeChange}
                />
            </div>
        }
        { contextHolder }
    </div>
})