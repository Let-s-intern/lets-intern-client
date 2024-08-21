import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const programName = '포트폴리오 조지기';
const type = '포트폴리오';

const radioSx = {
  color: '#E7E7E7',
  '&.Mui-checked': {
    color: '#5177FF',
  },
};
const timeOptions = [10, 11, 12, 13, 14];

const ReportApplyPage = () => {
  return (
    <div>
      <h1>진단서 신청하기</h1>
      <div>
        <span>❗신청 전 꼭 읽어주세요</span>
        <p>
          내용내용내용 내용내용내용 내용내용내용 내용내용내용내용내용
          내용내용내용 내용내용내용 내용내용
        </p>
      </div>
      <div>
        <div>
          <h2>프로그램 정보</h2>
          <img
            src="/icons/message-question-circle.svg"
            alt="프로그램 정보 도움말"
          />
        </div>
        <div>
          <img src="" alt="" />
          <div>
            <span>{programName}</span>
            <div>
              <div>
                <span>상품</span>
                <span>서류 진단서 (베이직), 맞춤 첨삭</span>
              </div>
              <div>
                <span>옵션</span>
                <span>현직자 피드백</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2>
          진단용 {type}
          <span>*</span>
        </h2>
        <FormControl>
          <RadioGroup defaultValue="file" name="radio-buttons-group">
            <div>
              <div>
                <FormControlLabel
                  value="file"
                  control={<Radio sx={radioSx} />}
                  label="파일 첨부"
                />
                <span>(pdf, doc, docx 형식 지원)</span>
              </div>
              <button>파일 업로드</button>
            </div>
            <div>
              <FormControlLabel
                value="url"
                control={<Radio sx={radioSx} />}
                label="URL"
              />
              <div>
                <input type="text" placeholder="https://" />
                <button>링크 확인</button>
              </div>
            </div>
          </RadioGroup>
        </FormControl>
      </div>
      <div>
        <div>
          <h2>(프리미엄) 채용공고*</h2>
          <span>희망하는 기업의 채용공고를 첨부해주세요.</span>
        </div>
        <FormControl>
          <RadioGroup defaultValue="file" name="radio-buttons-group">
            <div>
              <div>
                <FormControlLabel
                  value="file"
                  control={<Radio sx={radioSx} />}
                  label="파일 첨부"
                />
                <span>(pdf, doc, docx 형식 지원)</span>
              </div>
              <span>
                *채용공고에 포함된 업무, 지원자격, 우대사항이 보이게
                캡처해주세요.
              </span>
              <button>파일 업로드</button>
            </div>
            <div>
              <FormControlLabel
                value="url"
                control={<Radio sx={radioSx} />}
                label="URL"
              />
              <div>
                <input type="text" placeholder="https://" />
                <button>링크 확인</button>
              </div>
            </div>
          </RadioGroup>
        </FormControl>
      </div>
      <div>
        <div>
          <div>
            <h2>맞춤 첨삭 일정</h2>
            <img
              src="/icons/message-question-circle.svg"
              alt="프로그램 정보 도움말"
            />
          </div>
          <span>희망하시는 맞춤 첨삭(40분) 일정을 1개 이상 선택해주세요.</span>
        </div>
        <div>
          <h3>희망순위1*</h3>
          <div>
            <DatePicker format="YY년 M월 D일(dd)" label="날짜 선택" />
            <FormControl sx={{ minWidth: 100 }}>
              <InputLabel id="time-select-label">시간 선택</InputLabel>
              <Select labelId="time-select-label" label="시간 선택">
                {timeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {`${option < 12 ? '오전' : '오후'} ${option < 13 ? option : option - 12}:00`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div>
          <h3>희망순위2</h3>
          <div>
            <DatePicker format="YY년 M월 D일(dd)" label="날짜 선택" />
            <FormControl sx={{ minWidth: 100 }}>
              <InputLabel id="time-select-label">시간 선택</InputLabel>
              <Select labelId="time-select-label" label="시간 선택">
                {timeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {`${option < 12 ? '오전' : '오후'} ${option < 13 ? option : option - 12}:00`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div>
          <h3>희망순위3</h3>
          <div>
            <DatePicker format="YY년 M월 D일(dd)" label="날짜 선택" />
            <FormControl sx={{ minWidth: 100 }}>
              <InputLabel id="time-select-label">시간 선택</InputLabel>
              <Select labelId="time-select-label" label="시간 선택">
                {timeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {`${option < 12 ? '오전' : '오후'} ${option < 13 ? option : option - 12}:00`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <div>
        <h2>추가 정보</h2>
        <div>
          <span>희망직무 *</span>
          <input type="text" />
        </div>
        <div>
          <span>서류 작성 고민</span>
          <input type="text" />
        </div>
      </div>
    </div>
  );
};
export default ReportApplyPage;
