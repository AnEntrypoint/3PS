const { createApp } = Vue;

createApp({
  data() {
    return {
      collections: {},
      activeTab: 'team',
      loading: true,
      error: null,
      showModal: false,
      showFilesModal: false,
      isEditing: false,
      currentRecord: {},
      modalError: null,
      modalSuccess: null,
      isDragOver: false,
      collectionConfigs: {
        team: { id: 'pbc_3824009647', fields: ['name', 'nickname', 'bio', 'role'] },
        musician: { id: '5rod2tewrl0ov3d', fields: ['name', 'genre', 'bio', 'site', 'route'] },
        artist: { id: '3jnleendml5ld46', fields: ['title', 'desc', 'bio', 'site', 'route'] },
        partner: { id: 'cx8afblkixaub05', fields: ['name', 'site'] },
        metaverse: { id: '0ct1vfvg71ebu9r', fields: ['title', 'desc', 'url'] }
      }
    };
  },

  async mounted() {
    await this.loadCollections();
  },

  methods: {
    async loadCollections() {
      try {
        this.loading = true;
        this.error = null;
        const response = await axios.get('/api/collections');
        this.collections = response.data;
        this.loading = false;
      } catch (error) {
        this.error = 'Failed to load collections: ' + error.message;
        this.loading = false;
      }
    },

    setActiveTab(tab) {
      this.activeTab = tab;
      this.closeModal();
      this.closeFilesModal();
    },

    getCollectionFields(collection) {
      return this.collectionConfigs[collection]?.fields || [];
    },

    getFieldType(field) {
      if (field === 'site' || field === 'url') return 'url';
      if (field === 'route') return 'text';
      return 'text';
    },

    getRecordImages(record) {
      if (!record.pic) return [];
      if (Array.isArray(record.pic)) return record.pic;
      if (typeof record.pic === 'string') {
        try {
          return JSON.parse(record.pic);
        } catch {
          return [record.pic];
        }
      }
      return [];
    },

    getImageUrl(collection, recordId, filename) {
      const collectionId = this.collectionConfigs[collection]?.id || collection;
      return `/api/files/${collectionId}/${recordId}/${filename}`;
    },

    openCreateModal() {
      this.isEditing = false;
      this.currentRecord = {};
      this.showModal = true;
      this.modalError = null;
      this.modalSuccess = null;
    },

    openEditModal(record) {
      this.isEditing = true;
      this.currentRecord = { ...record };
      this.showModal = true;
      this.modalError = null;
      this.modalSuccess = null;
    },

    openFilesModal(record) {
      this.currentRecord = { ...record };
      this.showFilesModal = true;
      this.modalError = null;
      this.modalSuccess = null;
    },

    closeModal() {
      this.showModal = false;
      this.currentRecord = {};
      this.modalError = null;
      this.modalSuccess = null;
    },

    closeFilesModal() {
      this.showFilesModal = false;
      this.currentRecord = {};
      this.modalError = null;
      this.modalSuccess = null;
    },

    async saveRecord() {
      try {
        this.modalError = null;
        
        let response;
        if (this.isEditing) {
          response = await axios.put(
            `/api/collections/${this.activeTab}/${this.currentRecord.id}`,
            this.currentRecord
          );
        } else {
          response = await axios.post(
            `/api/collections/${this.activeTab}`,
            this.currentRecord
          );
        }

        this.modalSuccess = this.isEditing ? 'Record updated successfully!' : 'Record created successfully!';
        
        // Reload collections to get updated data
        await this.loadCollections();
        
        setTimeout(() => {
          this.closeModal();
        }, 1500);

      } catch (error) {
        this.modalError = 'Failed to save record: ' + (error.response?.data?.error || error.message);
      }
    },

    async deleteRecord(record) {
      if (!confirm(`Are you sure you want to delete "${record.name || record.title || record.id}"? This will also delete all associated files.`)) {
        return;
      }

      try {
        await axios.delete(`/api/collections/${this.activeTab}/${record.id}`);
        await this.loadCollections();
      } catch (error) {
        alert('Failed to delete record: ' + (error.response?.data?.error || error.message));
      }
    },

    handleFileDrop(event) {
      this.isDragOver = false;
      const files = Array.from(event.dataTransfer.files);
      this.uploadFiles(files);
    },

    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      this.uploadFiles(files);
      // Clear the input
      event.target.value = '';
    },

    async uploadFiles(files) {
      if (!files.length) return;

      try {
        this.modalError = null;
        
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file);
        });

        const response = await axios.post(
          `/api/collections/${this.activeTab}/${this.currentRecord.id}/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        this.modalSuccess = `${files.length} file(s) uploaded successfully!`;
        
        // Update current record with new file info
        this.currentRecord = response.data.record;
        
        // Reload collections
        await this.loadCollections();

        setTimeout(() => {
          this.modalSuccess = null;
        }, 3000);

      } catch (error) {
        this.modalError = 'Failed to upload files: ' + (error.response?.data?.error || error.message);
      }
    },

    async deleteFile(filename) {
      if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
        return;
      }

      try {
        this.modalError = null;
        
        const response = await axios.delete(
          `/api/collections/${this.activeTab}/${this.currentRecord.id}/files/${filename}`
        );

        this.modalSuccess = 'File deleted successfully!';
        
        // Update current record
        this.currentRecord = response.data.record;
        
        // Reload collections
        await this.loadCollections();

        setTimeout(() => {
          this.modalSuccess = null;
        }, 3000);

      } catch (error) {
        this.modalError = 'Failed to delete file: ' + (error.response?.data?.error || error.message);
      }
    }
  }
}).mount('#app');