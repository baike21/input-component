import {Component, Input, OnInit} from '@angular/core';
import {isUndefined} from 'util';

@Component({
  selector: 'app-input',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class InputComponent implements OnInit {

  @Input() showAlert: boolean; // 是否显示气泡提示
  @Input() iconType: string;   // user,lock,email,etc
  @Input() inputName: string;  // 气泡提示中文用户名，密码，邮箱
  @Input() id: number;
  @Input() name: string;  // username,password,email,etc
  @Input() type: string;  // txt,password,etc
  @Input() placeholder: string;

  // 值
  public value: string;
  //　状态位
  public loading: boolean;  // 正在去服务器申请登陆中的状态
  public submitted: boolean;  // 用户已经按下登陆键时为真
　
  public focused: boolean;  // 光标是否聚焦
  public blured: boolean;

  currentStyles: {};  // 当前输入框的样式

  constructor() {
  }

  // username控件的样式设置
  setCurrentStyles() {
    this.currentStyles = {
      'box-shadow': this.focused && !this.submitted ? '0 0 10px #4169E1' : this.invalidValue() ? '0 0 10px #B22222' : 'none',
    };
    return this.currentStyles;
  }

  // 当前输入框样式监听
  invalidValue() {
    if (this.invalidFormat() || this.invalidSubmit()) {
      return true;
    } else {
      return false;
    }
  }

  // 初始化执行函数
  ngOnInit() {
    this.loading = false;
    this.submitted = false;
    this.focused = true;
    this.blured = false;
    this.setCurrentStyles();
  }

  // 光标聚焦到输入框的事件
  FocusEvent() {
    this.focused = true;
    this.blured = false;
    this.submitted = false;

  }

  // 用户名blur事件,只关心描述控件的状态位
  BlurEvent() {
    this.blured = true;
    this.focused = false;
  }
  // 邮箱格式校验
  private checkEmail(raw_email: string) {
    // 格式检测对字符串前后的无效字符例如空格是容忍的
    const emailRegex = /^\s*[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}\s*$/;
    if (emailRegex.test(raw_email)) {
      return true;  // 合法的邮箱格式
    } else {
      console.log('invalid email address');
      return false;
    }
  }

  // 手机号格式校验 1** ********
  private checkPhone(raw_phone: string) {
    // 根据移动联通电信三大运营商的号码 正则表达式前3位随时保持更新 后面是8位数字
    const PhoneReg = /^\s*((13[0-9])|(14[5|7])|(15([0|3]|[5-9]))|(18[0,5-9])|(17[0-9]))\d{8}\s*$/;
    if (PhoneReg.test(raw_phone)) {
      return true;  // 合法手机号
    } else {
      console.log('invalid phone number');
      return false;
    }
  }

  // 判别邮箱格式，只关心绑定的数据
  invalidEmailFormat() {
    // 先做输入值非空检查
    // 用户什么都没输(pristine)或者输入了又删掉了（novalue）, 或者输入一串空格之类的无效字符，检测器都不进行格式检查
    if (!( isUndefined(this.value) || this.value === '' ) && !(/^\s+$/.test(this.value))) {
      // 检查一下email格式
      if (this.checkEmail(this.value) || this.focused) {
        return false;  // 格式正确或者有光标在 气泡不显示
      } else {
        return true;  // 格式不对且失去焦点时 气泡显示
      }
    } else {
      return false;
    }
  }


  // 判别phone格式是否错误
  invalidPhoneFormat() {
    if (!( isUndefined(this.value) || this.value === '' ) && !(/^\s+$/.test(this.value))) {
      // 检查一下phone格式
      if (this.checkPhone(this.value) || this.focused) {
        return false;  // phone格式正确,光标定位在控件上时认为处于待修改状态，也不显示
      } else {
        return true;  // phone格式不对
      }
    } else {
      return false;
    }
  }

  // 查询状态，决定是否显示格式错误的气泡
  invalidFormat() {
    // 两种格式错误
    if (!this.invalidEmailFormat() || !this.invalidPhoneFormat()) {
      console.log('不认为格式有误');
      return false;
    } else {
      return true;
    }
  }

  // 查看状态,决定提交后是否显示空用户名的气泡
  invalidSubmit() {
    if (this.submitted) {
      // 非空检查
      if (isUndefined(this.value) || this.value === '' || /^\s+$/.test(this.value)) {
        console.log('提交的用户名为空');
        return true;  // 不合法的用户名输入,显示错误提示给用户
      } else {
        return false;
      }
    } else {
      return false;  // 用户没点提交键，不显示
    }
  }

  // 登陆键被点击
  submit() {
    this.submitted = true;
    this.focused = false;
    this.blured = true;
    // 根据错误校验状态，关闭开启光标状态
    if (this.invalidValue()) {
      console.log('用户名通不过校验');
    } else {
      // 当所有检查都通过了，去服务器申请登陆
      this.loading = true;
      this.submitted = false;
      console.log('access!');
    }

  }

}


