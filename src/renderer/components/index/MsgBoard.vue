<template>
  <div>
    <v-card class="index-main-message-board" elevation="0">
      <v-scroll-x-transition>
        <div v-if="contentIsNull === true" style="text-align: center;">
          <v-icon style="margin-top: 60px; margin-bottom: 40px; color: white; opacity: 80%;" size="42">mdi-bell-off-outline</v-icon>
          <p style="font-size: 24px; color: rgba(255, 255, 255, 95%);">暂无通知</p>
          <v-btn
            color="transparent"
            elevation="0"
            @click.stop="manageDialog = true"
          >
            <v-icon style="color: rgba(255, 255, 255, 100%);">mdi-pencil-outline</v-icon>&nbsp;<font style="color: rgba(255, 255, 255, 100%);">管理通知</font>
          </v-btn>
        </div>
      </v-scroll-x-transition>
      <v-scroll-x-transition>
        <div v-if="contentIsNull === false" style="text-align: left; color: white;">
          <v-card-title>
            <span style="font-size: 24px;">通知</span>
            <v-spacer />
            <v-icon
              rounded
              elevation="0"
              style="color: white;"
              @click.stop="manageDialog = true"
            >
              mdi-pencil-outline
            </v-icon>
          </v-card-title>
          <v-card-subtitle style="font-size: 18px;">共有 {{ totalMessages }} / 5 条通知</v-card-subtitle>
          <v-alert
            v-for="messageObj in msgLs.msgArray"
            :key="messageObj.id"
            prominent
            border="left"
            class="msgboard-alert"
            :type="messageObj.level"
            :color="messageObj.color"
            :icon="messageObj.icon"
          >
            {{ messageObj.content }}
          </v-alert>
        </div>
      </v-scroll-x-transition>
    </v-card>
    <v-dialog
      v-model="addDialog"
      persistent
      max-width="700"
    >
      <v-card>
        <v-card-title class="text-h5">
          添加通知
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="newMsgContent"
              :error="isNewMsgContentInvalid.status"
              :error-messages="isNewMsgContentInvalid.errorMessage"
              prepend-icon="mdi-message-text-outline"
              label="消息内容"
              required
            />
            <v-select
              v-model="newMsgType"
              :error="isNewMsgTypeInvalid.status"
              :error-messages="isNewMsgTypeInvalid.errorMessage"
              prepend-icon="mdi-shape-outline"
              label="消息类型"
              :items="msgTypes"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue lighten-2"
            text
            @click="addNewMsg()"
          >
            完成
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="editDialog"
      persistent
      max-width="700"
    >
      <v-card>
        <v-card-title class="text-h5">
          修改通知
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="curMsgContent"
              :error="isCurMsgContentInvalid.status"
              :error-messages="isCurMsgContentInvalid.errorMessage"
              prepend-icon="mdi-message-text-outline"
              label="消息内容"
              required
            />
            <v-select
              v-model="curMsgType"
              :error="isCurMsgTypeInvalid.status"
              :error-messages="isCurMsgTypeInvalid.errorMessage"
              prepend-icon="mdi-shape-outline"
              label="消息类型"
              :items="msgTypes"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue lighten-2"
            text
            @click="saveEditedMsg()"
          >
            完成
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="manageDialog"
      persistent
      max-width="580"
    >
      <v-card>
        <v-card-title class="text-h5">
          管理通知
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-subheader>通知列表</v-subheader>
            <v-list-item-group
              v-model="manageSelectedMsg"
              color="primary"
            >
              <v-list-item
                v-for="msgObj in msgLs.msgArray"
                :key="msgObj.id"
              >
                <v-list-item-icon>
                  <v-icon v-text="msgObj.icon" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="msgObj.content" />
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            :disabled="msgLs.msgArray.length >= 5"
            @click="addDialog = true"
          >
            <v-icon>mdi-plus</v-icon>
            添加
          </v-btn>
          <v-btn
            text
            :disabled="manageSelectedMsg === null || manageSelectedMsg === undefined"
            @click="editDialog = true"
          >
            <v-icon>mdi-pencil-outline</v-icon>
            修改
          </v-btn>
          <v-btn
            color="red darken-2"
            text
            :disabled="manageSelectedMsg === null || manageSelectedMsg === undefined"
            @click="delCurMsg()"
          >
            <v-icon>mdi-trash-can-outline</v-icon>
            删除
          </v-btn>
          <v-btn
            color="red darken-2"
            text
            :disabled="contentIsNull"
            @click="clearMsg()"
          >
            <v-icon>mdi-close</v-icon>
            清空
          </v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue lighten-2"
            text
            @click="manageDialog = false"
          >
            完成
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'MsgBoard',
  data: () => ({
    contentIsNull: true,
    totalMessages: 0,
    msgLs: {
      msgArray: [
      ]
    },
    manageDialog: false,
    manageSelectedMsg: undefined,
    editDialog: false,
    addDialog: false,
    targetMsgContent: '',
    targetMsgType: '',
    msgTypes: ['info', 'warning', 'fatal', 'run'],
    msgTypeTemplate: {
      info: {
        type: 'info',
        color: 'rgb(143, 182, 255)',
        icon: 'mdi-information-outline'
      },
      warning: {
        type: 'warning',
        color: 'rgb(251, 139, 0)',
        icon: 'mdi-alert-outline'
      },
      fatal: {
        type: 'fatal',
        color: 'rgb(255, 110, 110)',
        icon: 'mdi-alert-octagon-outline'
      },
      run: {
        type: 'run',
        color: 'rgb(122, 146, 158)',
        icon: 'mdi-bed-outline'
      }
    },
    curMsgType: null,
    curMsgContent: '',
    curMsgId: null,
    newMsgContent: '',
    newMsgType: ''
  }),
  computed: {
    isCurMsgTypeInvalid () {
      const validateInfo = {}
      validateInfo.status = ['', null].includes(this.$data.curMsgType)
      validateInfo.errorMessage = validateInfo.status ? '请选择消息类型以继续' : ''
      return validateInfo
    },
    isCurMsgContentInvalid () {
      const validateInfo = {}
      validateInfo.status = ['', null].includes(this.$data.curMsgContent)
      validateInfo.errorMessage = validateInfo.status ? '请填写消息内容以继续' : ''
      return validateInfo
    },
    isNewMsgContentInvalid () {
      const validateInfo = {}
      validateInfo.status = ['', null].includes(this.$data.newMsgContent)
      validateInfo.errorMessage = validateInfo.status ? '请填写消息内容以继续' : ''
      return validateInfo
    },
    isNewMsgTypeInvalid () {
      const validateInfo = {}
      validateInfo.status = ['', null].includes(this.$data.newMsgType)
      validateInfo.errorMessage = validateInfo.status ? '请选择消息类型以继续' : ''
      return validateInfo
    }
  },
  watch: {
    manageSelectedMsg (manageSelectedMsg, _oldManageSelectedMsg) {
      if (manageSelectedMsg !== undefined) {
        const { msgLs } = this.$data
        if (msgLs.msgArray[manageSelectedMsg] === undefined) { return }
        this.$data.curMsgType = msgLs.msgArray[manageSelectedMsg].type
        this.$data.curMsgId = msgLs.msgArray[manageSelectedMsg].id
        this.$data.curMsgContent = msgLs.msgArray[manageSelectedMsg].content
      }
    }
  },
  mounted () {
    this.readMsgInfoFromLocalStorage()
    const { msgLs } = this.$data
    msgLs.msgArray.length === 0 ? this.switchMsgAStats(true) : this.switchMsgAStats(false)
    // Update the total msg count
    this.$data.totalMessages = msgLs.msgArray.length
  },
  methods: {
    switchMsgAStats (target) {
      if (this.$data.contentIsNull === !target) {
        this.$data.contentIsNull = null
        setTimeout(() => { this.$data.contentIsNull = target }, 400)
      }
      /*
      if (this.$data.contentIsNull === null) {
        this.$data.contentIsNull = target
      }
      */
    },
    readMsgInfoFromLocalStorage () {
      const msgInfoValue = localStorage.getItem('msgInfo')
      this.$data.msgLs = JSON.parse(msgInfoValue)
      if (this.$data.msgLs === null) {
        this.$data.msgLs = {}
        this.$data.msgLs.msgArray = []
        localStorage.setItem('msgInfo', JSON.stringify(this.$data.msgLs))
      }
    },
    addNewMsg () {
      const isNewlyAdded = this.$data.contentIsNull
      const { msgArray } = this.$data.msgLs
      const newMsgObj = {}
      newMsgObj.id = msgArray.length + 1
      newMsgObj.content = this.$data.newMsgContent
      Object.assign(newMsgObj, this.msgTypeTemplate[this.$data.newMsgType])
      if ((newMsgObj.content === '' ||
      newMsgObj.content === undefined) ||
      newMsgObj.type === undefined) {
        return false
      }
      this.$data.msgLs.msgArray.push(newMsgObj)
      localStorage.setItem('msgInfo', JSON.stringify(this.$data.msgLs))
      // Switch layout if the msg is newly added
      if (isNewlyAdded) { this.switchMsgAStats(false) }
      // Close the dialog
      this.$data.addDialog = false
      // Clear vars
      this.$data.newMsgContent = ''
      this.$data.newMsgType = ''
      // Update the total msg count
      this.$data.totalMessages = msgArray.length
    },
    saveEditedMsg () {
      const newMsgObj = {}
      const { curMsgId, curMsgContent, curMsgType } = this.$data
      newMsgObj.id = curMsgId
      newMsgObj.content = curMsgContent
      Object.assign(newMsgObj, this.$data.msgTypeTemplate[curMsgType])
      if ((newMsgObj.content === '' ||
      newMsgObj.content === undefined) ||
      newMsgObj.type === undefined) {
        return false
      }
      this.$data.msgLs.msgArray[curMsgId - 1] = newMsgObj
      localStorage.setItem('msgInfo', JSON.stringify(this.$data.msgLs))
      // Close the dialog
      this.$data.editDialog = false
      // Clear vars
      this.$data.curMsgType = null
      this.$data.curMsgId = null
      this.$data.curMsgContent = ''
      this.$data.manageSelectedMsg = null
      // Update the total msg count
      this.$data.totalMessages = this.$data.msgLs.msgArray.length
    },
    delCurMsg () {
      let isGoingToBeCleared = null
      this.$data.msgLs.msgArray.length === 1 ? isGoingToBeCleared = true : isGoingToBeCleared = false
      this.$data.msgLs.msgArray.splice(this.$data.curMsgId - 1, 1)
      // Reassign id
      for (let i = 0; i < this.$data.msgLs.msgArray.length; i++) {
        this.$data.msgLs.msgArray[i].id = i + 1
      }
      // Update the cookie
      localStorage.setItem('msgInfo', JSON.stringify(this.$data.msgLs))
      // Switch the layout if the msg is be cleared
      if (isGoingToBeCleared) {
        this.switchMsgAStats(true)
      }
      // Clear vars
      this.$data.curMsgType = null
      this.$data.curMsgId = null
      this.$data.curMsgContent = ''
      this.$data.manageSelectedMsg = null
      // Update the total msg count
      this.$data.totalMessages = this.$data.msgLs.msgArray.length
    },
    clearMsg () {
      // Clear Array
      this.$data.msgLs.msgArray = []
      // Update the cookie
      localStorage.setItem('msgInfo', JSON.stringify(this.$data.msgLs))
      // Switch the layout
      this.switchMsgAStats(true)
      // Clear vars
      this.$data.curMsgType = null
      this.$data.curMsgId = null
      this.$data.curMsgContent = ''
      this.$data.manageSelectedMsg = null
      // Update the total msg count
      this.$data.totalMessages = this.$data.msgLs.msgArray.length
    }
  }
}
</script>

<style>

.index-main-message-board {
  background-color: rgba(255, 255, 255, 0.4) !important;
  max-width: 90%;
  margin: 10px auto;
  min-height: 270px;
  padding-bottom: 20px;
}

.v-alert__content {
  color: white;
}

.v-alert__icon {
  color: white !important;
}

.msgboard-alert {
  font-size: 21px;
  max-width: 95%;
  margin: auto;
}

</style>
