import { useContext, useState } from 'react';
import { MouseEventHandler, ReactElement } from 'react';

import { useTranslation } from 'next-i18next';

import HomeContext from '@/pages/api/home/home.context';

import { DashButton } from '../Buttons/DashButton'
import { FileUploader } from '../Upload/FileUploader';

export const FileLoader = () => {
  const { t } = useTranslation('chat');

  const [files, setFiles] = useState<File[]>()
  const handleUpload = (files: File[]) => {
    setFiles(files)
    console.log(files);
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    console.log(e);
  };

  return (
    <>
      <FileUploader handleUpload={handleUpload} />
      <DashButton
        handleClick={() => {
          console.log('sure');
        }}
      >
        <div>确认</div>
      </DashButton>
    </>
  );
};
