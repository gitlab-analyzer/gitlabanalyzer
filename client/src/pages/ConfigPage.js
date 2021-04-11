import React, { useEffect } from 'react';
import Header from '../components/Header';
import LanguagePoints from '../components/config/LanguagePoints';
import IterationDates from '../components/config/IterationDates';
import InitialUserDates from '../components/config/InitialUserDates';
import FooterBar from '../components/FooterBar';
import {
  Form,
  Divider,
  Row,
  Col,
  Button,
  Input,
  notification,
  Select,
  Switch,
} from 'antd';
import { useAuth } from '../context/AuthContext';
import { SaveOutlined } from '@ant-design/icons';

const { Option } = Select;
export var SavedConfigs = {};
const ConfigPage = () => {
  const {
    dataList,
    setDataList,
    currentConfig,
    setCurrentConfig,
    anon,
    setAnon,
    mergeRequestList,
    setMergeRequestList,
  } = useAuth();
  const [form] = Form.useForm();

  let lang = {};

  const multiplier = [0, 0, 0, 0, 1, 0.2, 0, 0.2];
  const fields = [
    'lines_added',
    'lines_deleted',
    'comments_added',
    'comments_deleted',
    'blanks_added',
    'blanks_deleted',
    'spacing_changes',
    'syntax_changes',
  ];

  const mrScore = (codediffdetail, singleFile) => {
    let index;
    let totalScore = 0;
    // maybe move file type
    let totalFileType = {};

    if (singleFile) {
      let lines = codediffdetail['line_counts'];
      let ext = codediffdetail['file_type'];
      index = 0;

      for (let type in lines) {
        totalScore += lines[type] * multiplier[index];
        index++;
      }

      if (ext in lang) {
        totalScore *= lang[ext];
      }
      return totalScore;
    } else {
      for (let [k1, file] of Object.entries(codediffdetail)) {
        let score = 0;
        let lines = file['line_counts'];
        let ext = file['file_type'];
        index = 0;
        for (let type in lines) {
          score += lines[type] * multiplier[index];
          index++;
        }
        if (ext in lang) {
          score *= lang[ext];
        }
        if (ext in totalFileType) {
          totalFileType[ext] += score;
        } else {
          totalFileType[ext] = score;
        }
        totalScore += score;
      }
      return totalScore;
    }
  };

  const recalculateScores = () => {
    if (currentConfig.language) {
      for (let [langkey, langvalue] of Object.entries(currentConfig.language)) {
        lang[langvalue.extname] = langvalue.extpoint;
      }
    }

    const tempMR = {};
    // Loop through object key
    for (let user in mergeRequestList) {
      console.log('mrList', mergeRequestList);
      tempMR[user] = {
        mr: {},
        weightedScore: 0,
      };
      // Loop through object item
      for (let [key, author] of Object.entries(mergeRequestList[user]['mr'])) {
        let tempCommits = {};
        for (let [k1, commit] of Object.entries(author.commitList)) {
          tempCommits[k1] = {
            ...commit,
            score: mrScore(commit.codeDiffDetail, false),
          };
          // Calculates and embeds a score for each file within a commit
          for (let [k, v1] of Object.entries(
            tempCommits[k1]['codeDiffDetail']
          )) {
            tempCommits[k1]['codeDiffDetail'][k]['score'] = mrScore(v1, true);
            tempCommits[k1]['codeDiffDetail'][k]['ignore'] = false;
          }
        }
        tempMR[user].mr[author.id] = {
          ...mergeRequestList[user].mr[author.id],
          commitList: tempCommits,
          score: mrScore(author.codeDiffDetail, false),
        };

        // Experimental
        for (let [k1, v1] of Object.entries(
          tempMR[user].mr[author.id]['codeDiffDetail']
        )) {
          tempMR[user].mr[author.id]['codeDiffDetail'][k1]['score'] = mrScore(
            v1,
            true
          );
          tempMR[user].mr[author.id]['codeDiffDetail'][k1]['ignore'] = false;
        }
      }
    }
    return tempMR;
  };

  useEffect(() => {
    form.setFieldsValue(currentConfig);
    recalculateScores();
    console.log('New MR: ', mergeRequestList);
  }, []);

  const handleSave = (value) => {
    SavedConfigs[value.configname] = value;
    setCurrentConfig(value);
    setDataList(value.date);

    notification.open({
      message: 'Saved Config',
      icon: <SaveOutlined style={{ color: '#00d100' }} />,
      duration: 1.5,
    });
  };

  const fillForm = (value) => {
    setCurrentConfig(SavedConfigs[value]);
    setDataList(SavedConfigs[value].date);
    setAnon(SavedConfigs[value].anon);
    form.setFieldsValue(SavedConfigs[value]);
  };

  return (
    <>
      <Header />
      <Form style={{ padding: '3% 3% 0 3%' }} onFinish={handleSave} form={form}>
        <Select
          style={{
            width: 429,
            display: 'flex',
            marginRight: '-3%',
            marginTop: '-3%',
            right: 0,
            float: 'right',
          }}
          showSearch
          allowClear
          onSelect={fillForm}
          placeholder="Load Config File"
        >
          {Object.keys(SavedConfigs).map(function (key) {
            return <Option value={key}>{key}</Option>;
          })}
        </Select>
        <InitialUserDates />
        <Divider />
        <Row gutter={120}>
          <Col>
            <IterationDates />
          </Col>
          <Col>
            <LanguagePoints />
          </Col>
        </Row>
        <Divider />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
          }}
        >
          <div>
            <h6>Turn on Anonymous Viewing: </h6>
            <Form.Item name="anon" initialValue={anon} valuePropName="checked">
              <Switch onChange={setAnon} />
            </Form.Item>
          </div>
          <div className="buttonContainer" style={{ display: 'flex' }}>
            <Form.Item
              name="configname"
              rules={[
                {
                  required: true,
                  message: 'Please input a name.',
                },
              ]}
            >
              <Input style={{ marginRight: 100 }} size="large" />
            </Form.Item>
            <Button htmlType="submit" size="large" type="primary">
              Save As
            </Button>
          </div>
        </div>
      </Form>
      <FooterBar />
    </>
  );
};

export default ConfigPage;
