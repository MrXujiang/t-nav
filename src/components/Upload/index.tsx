import { 
    Upload, 
  } from 'antd';
import ImgCrop from 'antd-img-crop';
import { getToken } from '@/utils/req';

import { memo, useState, useEffect } from 'react';

export default memo((props) => {
    const { fileList, onChange } = props;
    const [files, setFiles] = useState([]);
    const handleChange = (value) => {
        const { file, fileList } = value;
        setFiles(fileList);
        if(file.status === 'done') {
            onChange && onChange(fileList.map(v => {
                if(v.originFileObj) {
                    return {
                        ...v?.response?.data
                    }
                }
                return v
            }))
        }
    }

    const handleRemove = (file: File) => {
        const newFiles = files.filter(v => v.uid !== file.uid);
        onChange && onChange(newFiles)
        setFiles(newFiles)
    }

    useEffect(() => {
        if(fileList) {
            setFiles(fileList.map((v: any, i: number) => {
                return {
                    ...v,
                    uid: 'cxzk_' + i,
                    status: 'done'
                }
            }))
        }
    }, [fileList])
    return <ImgCrop rotationSlider aspect={4 / 3} showGrid aspectSlider showReset zoomSlider quality={0.7}>
                <Upload
                    action={`${serverApi}/api/v0/files/upload`}
                    listType="picture-card"
                    onChange={handleChange}
                    fileList={files}
                    onRemove={handleRemove}
                    headers={{
                    'X-Requested-With': 'mark',
                    'Authorization': `Bearer ${getToken()}`,
                    }}
                >
                    + 上传
                </Upload>
    </ImgCrop>
})